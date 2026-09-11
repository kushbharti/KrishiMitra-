import io
import json
import os
import time
from typing import Any, Dict, List, Tuple
from fastapi import HTTPException
import numpy as np
import onnxruntime as ort
from PIL import Image
import torch
import torchvision.transforms as transforms

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_DIR = os.path.join(BASE_DIR, "config")
DATA_DIR = os.path.join(BASE_DIR, "data")

MODEL_FILENAME = os.getenv("MODEL_FILENAME", "agrovision_model.onnx")
MODEL_PATH = os.path.join(BASE_DIR, MODEL_FILENAME)

if not os.path.exists(MODEL_PATH):
    for alt in ["agrovision_model.onnx", "plant_disease_model.onnx", "model.onnx"]:
        alt_path = os.path.join(BASE_DIR, alt)
        if os.path.exists(alt_path):
            MODEL_PATH = alt_path
            break


class DiseaseModelService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DiseaseModelService, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        if hasattr(self, "_initialized") and self._initialized:
            return

        print(f"[AgroVision AI] Loading exported ONNX model from: {MODEL_PATH}")
        self.session = self._load_onnx_session()

        try:
            input_shape = self.session.get_inputs()[0].shape
            expected_h = int(input_shape[2])
            expected_w = int(input_shape[3])
            self.input_size = (expected_h, expected_w)
            print(f"[AgroVision AI] Auto-detected model input dimensions: {expected_h}x{expected_w}")
        except (IndexError, ValueError, TypeError):
            self.input_size = (300, 300)
            print(f"[AgroVision AI WARNING] Defaulting input dimensions to {self.input_size}")

        self.class_names = self._load_json(os.path.join(CONFIG_DIR, "class_names.json"))
        self.supported_crops_data = self._load_json(os.path.join(CONFIG_DIR, "supported_crops.json"))
        self.supported_crops = set(self.supported_crops_data.get("crops", []))
        self.metadata = self._load_json(os.path.join(DATA_DIR, "disease_metadata.json"))

        self.crop_to_indices: Dict[str, List[int]] = {}
        for idx_str, info in self.class_names.items():
            crop = info["crop"]
            if crop not in self.crop_to_indices:
                self.crop_to_indices[crop] = []
            self.crop_to_indices[crop].append(int(idx_str))

        self.transform = transforms.Compose([
            transforms.Resize(self.input_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        self._initialized = True

    def _load_json(self, path: str) -> Dict[str, Any]:
        if not os.path.exists(path):
            raise RuntimeError(f"[AgroVision AI Error] Configuration file missing at: {path}")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _load_onnx_session(self) -> ort.InferenceSession:
        if not os.path.exists(MODEL_PATH):
            raise RuntimeError(f"Model file not found at root path: {MODEL_PATH}")

        try:
            providers = (
                ["CUDAExecutionProvider", "CPUExecutionProvider"]
                if torch.cuda.is_available()
                else ["CPUExecutionProvider"]
            )
            session = ort.InferenceSession(MODEL_PATH, providers=providers)
            self.input_name = session.get_inputs()[0].name
            print(f"[AgroVision AI] ONNX Session initialized with providers: {session.get_providers()}")
            return session
        except Exception as e:
            error_msg = str(e)
            if "External data path does not exist" in error_msg or "ValidateExternalDataPathFromDir" in error_msg:
                print("\n" + "="*80)
                print("[AgroVision CRITICAL ERROR] Missing ONNX External Weights File!")
                print(f"Please copy 'agrovision_model.onnx.data' into this folder: {BASE_DIR}")
                print("="*80 + "\n")
            raise RuntimeError(f"Model initialization failure: {error_msg}")

    def get_supported_crops(self) -> List[str]:
        return sorted(list(self.supported_crops))

    def validate_crop(self, crop: str) -> bool:
        return crop in self.supported_crops

    def predict(self, image_bytes: bytes, selected_crop: str) -> Dict[str, Any]:
        start_time = time.time()

        if not self.validate_crop(selected_crop):
            raise HTTPException(
                status_code=400,
                detail=f"This crop '{selected_crop}' is not supported by the current disease detection model.",
            )

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid or corrupted image file. Please upload a valid image (JPG, PNG, WEBP).",
            )

        tensor_img = self.transform(image).unsqueeze(0).numpy().astype(np.float32)

        try:
            raw_outputs = self.session.run(None, {self.input_name: tensor_img})[0][0]
            logits = torch.tensor(raw_outputs)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

        # Step 3 & 4: Run inference across ALL classes and obtain full Softmax probabilities
        probabilities = torch.nn.functional.softmax(logits, dim=0)

        # Sort all classes by probability descending
        sorted_probs, sorted_indices = torch.sort(probabilities, descending=True)
        all_sorted = [(prob.item(), idx.item()) for prob, idx in zip(sorted_probs, sorted_indices)]

        # Step 5 & 6: Compare Selected Crop vs Detected Crop (from #1 highest confidence class overall)
        top_prob, top_idx = all_sorted[0]
        top_class_info = self.class_names[str(top_idx)]
        detected_crop = top_class_info["crop"]
        crop_match = (selected_crop == detected_crop)
        overall_confidence = round(top_prob * 100, 2)

        # Construct the unique 4-Card Prediction Distribution
        selected_candidates: List[Tuple[float, int]] = []
        used_indices = set()

        # Card 1: Highest confidence prediction overall
        if len(all_sorted) > 0:
            selected_candidates.append(all_sorted[0])
            used_indices.add(all_sorted[0][1])

        # Card 2: Second highest confidence prediction overall
        if len(all_sorted) > 1:
            selected_candidates.append(all_sorted[1])
            used_indices.add(all_sorted[1][1])

        # Card 3: Highest confidence prediction belonging to USER SELECTED crop different from Cards 1 & 2
        card3_found = False
        for prob, idx in all_sorted:
            if idx in used_indices:
                continue
            if self.class_names[str(idx)]["crop"] == selected_crop:
                selected_candidates.append((prob, idx))
                used_indices.add(idx)
                card3_found = True
                break
                
        if not card3_found:
            # Fallback if no unique selected_crop class remains
            for prob, idx in all_sorted:
                if idx not in used_indices:
                    selected_candidates.append((prob, idx))
                    used_indices.add(idx)
                    break

        # Card 4: Next highest unique prediction not already shown
        for prob, idx in all_sorted:
            if len(selected_candidates) >= 4:
                break
            if idx not in used_indices:
                selected_candidates.append((prob, idx))
                used_indices.add(idx)

        # Assemble enriched prediction payload
        # Assemble enriched prediction payload
        predictions_list = []
        for prob, idx in selected_candidates:
            class_info = self.class_names[str(idx)]
            pred_crop = class_info["crop"]
            disease_name = class_info["disease"]
            
            # Robust key generation and matching against metadata
            possible_keys = [
                f"{pred_crop}___{disease_name.replace(' ', '_')}",
                f"{pred_crop}_{disease_name.replace(' ', '_')}",
                f"{pred_crop}___{disease_name}",
                disease_name.replace(' ', '_'),
                disease_name
            ]
            
            meta = None
            for k in possible_keys:
                if k in self.metadata:
                    meta = self.metadata[k]
                    break
            
            if not meta:
                # Fallback search by case-insensitive matching
                for db_key, db_val in self.metadata.items():
                    if disease_name.lower() in db_key.lower():
                        meta = db_val
                        break

            default_meta = {
                "symptoms": [f"Observed leaf spotting or structural wilting typical of {disease_name}."],
                "causes": f"Infection caused by pathogens associated with {disease_name} in {pred_crop}.",
                "treatment": [
                    "Isolate affected foliage and prune infected plant tissue.",
                    "Consult local agricultural extension services for targeted fungicide application.",
                ],
                "prevention": [
                    "Maintain optimal plant spacing to promote airflow.",
                    "Implement systematic 2-3 year crop rotation schedules.",
                ],
                "fungicide": f"Consult certified agricultural chemical advisor for {pred_crop}.",
                "severity": "Medium",
                "recovery_tips": "Maintain balanced irrigation and avoid excess nitrogen while plants recover.",
            }

            if not meta:
                meta = default_meta

            predictions_list.append({
                "crop": pred_crop,
                "disease": disease_name,
                "confidence": round(prob * 100, 2),
                "healthy": class_info.get("healthy", False),
                "symptoms": meta.get("symptoms", default_meta["symptoms"]),
                "causes": meta.get("causes", default_meta["causes"]),
                "treatment": meta.get("treatment", default_meta["treatment"]),
                "prevention": meta.get("prevention", default_meta["prevention"]),
                "fungicide": meta.get("fungicide", default_meta["fungicide"]),
                "severity": meta.get("severity", default_meta["severity"]),
                "recovery_tips": meta.get("recovery_tips", default_meta["recovery_tips"]),
            })

        while len(predictions_list) < 4:
            predictions_list.append({
                "crop": "N/A",
                "disease": "N/A",
                "confidence": 0.0,
                "healthy": False,
                "symptoms": ["No additional prediction class available."],
                "causes": "Not applicable.",
                "treatment": ["No treatment required."],
                "prevention": ["No prevention required."],
                "fungicide": None,
                "severity": "Low",
                "recovery_tips": None,
            })

        top_pred = predictions_list[0]
        details = {
            "disease_name": top_pred["disease"],
            "crop_name": top_pred["crop"],
            "confidence": top_pred["confidence"],
            "healthy": top_pred["healthy"],
            "symptoms": top_pred["symptoms"],
            "causes": top_pred["causes"],
            "treatment": top_pred["treatment"],
            "prevention": top_pred["prevention"],
            "fungicide": top_pred["fungicide"],
            "severity": top_pred["severity"],
            "recovery_tips": top_pred["recovery_tips"],
        }

        low_confidence = overall_confidence < 60.0
        if not crop_match:
            msg = f"The uploaded image most likely belongs to {detected_crop} instead of {selected_crop}."
        elif low_confidence:
            msg = "Prediction confidence is low (<60%). Please upload a clearer image under proper lighting."
        elif top_pred["healthy"]:
            msg = f"Your {selected_crop} appears healthy! Continue standard maintenance."
        else:
            msg = f"Detected {top_pred['disease']} with {top_pred['confidence']}% confidence. Review treatment steps below."

        elapsed = time.time() - start_time
        print(f"[AgroVision AI] Inference completed in {elapsed:.3f}s. Match: {crop_match} ({selected_crop} vs {detected_crop})")

        return {
            "success": True,
            "selected_crop": selected_crop,
            "detected_crop": detected_crop,
            "crop_match": crop_match,
            "confidence": overall_confidence,
            "predictions": predictions_list,
            "details": details,
            "low_confidence": low_confidence,
            "message": msg,
        }


def get_disease_service() -> DiseaseModelService:
    return DiseaseModelService()