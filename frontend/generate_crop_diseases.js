// /**
//  * AgroVision Complete Multilingual Agronomic Database Generator
//  * Generates the full 75-class crop_diseases_75.json with EN, HI, and MR.
//  */

// const fs = require("fs");
// const path = require("path");

// // 1. Universal Generator for Healthy Foliage
// const createHealthy = (id, enCrop, hiCrop, mrCrop) => ({
//   en: {
//     id,
//     crop: enCrop,
//     diseaseName: "Healthy Foliage",
//     pathogenType: "Healthy",
//     severityLevel: "None",
//     symptoms: [
//       "Uniform deep green leaf surface with clean, unbroken venation.",
//       "No fungal sporulation, chlorotic halos, necrosis, or pest tunneling.",
//     ],
//     treatmentPlan: {
//       immediateAction: [
//         "No corrective chemical or curative fungicide required.",
//       ],
//       organicRemedies: [
//         {
//           name: "Seaweed Extract Biostimulant",
//           dosage: "2.0 ml/L",
//           applicationMethod: "Monthly foliar booster",
//         },
//       ],
//       chemicalRemedies: [],
//     },
//     prevention: [
//       "Continue standard micro-irrigation and balanced NPK scheduling.",
//       "Scout canopy bi-weekly for sucking pests and early fungal entry.",
//     ],
//   },
//   hi: {
//     id,
//     crop: hiCrop,
//     diseaseName: "स्वस्थ पौधा",
//     pathogenType: "Healthy",
//     severityLevel: "None",
//     symptoms: [
//       "पत्तियां एकसमान हरी और तरोताजा हैं, नसें पूरी तरह साफ हैं।",
//       "किसी भी प्रकार के कवक, धब्बे, झुलसा या कीट के लक्षण नहीं हैं।",
//     ],
//     treatmentPlan: {
//       immediateAction: [
//         "किसी भी रासायनिक कीटनाशक या कवकनाशी की आवश्यकता नहीं है।",
//       ],
//       organicRemedies: [
//         {
//           name: "समुद्री शैवाल अर्क (Seaweed Extract)",
//           dosage: "2 मिली/लीटर",
//           applicationMethod: "मासिक पर्णीय छिड़काव",
//         },
//       ],
//       chemicalRemedies: [],
//     },
//     prevention: [
//       "नियमित सिंचाई और संतुलित खाद प्रबंधन (NPK) जारी रखें।",
//       "कीटों की निगरानी के लिए पीले चिपचिपे ट्रैप लगाएं।",
//     ],
//   },
//   mr: {
//     id,
//     crop: mrCrop,
//     diseaseName: "निरोगी पीक",
//     pathogenType: "Healthy",
//     severityLevel: "None",
//     symptoms: [
//       "पाने संपूर्णपणे निरोगी, तजेलदार आणि हिरवीगार आहेत.",
//       "कोणत्याही बुरशीचे, किडीचे किंवा विषाणूचे डाग नाहीत.",
//     ],
//     treatmentPlan: {
//       immediateAction: ["कोणत्याही रासायनिक फवारणीची आवश्यकता नाही."],
//       organicRemedies: [
//         {
//           name: "सीवीड अर्क (Seaweed Tonic)",
//           dosage: "2 मिली/लिटर",
//           applicationMethod: "महिन्यातून एकदा फवारणी",
//         },
//       ],
//       chemicalRemedies: [],
//     },
//     prevention: [
//       "योग्य पाणी आणि संतुलित खत व्यवस्थापन चालू ठेवा.",
//       "शेतात रसशोषक किडींवर लक्ष ठेवण्यासाठी चिकट सापळे लावा.",
//     ],
//   },
// });

// // 2. Verified Disease Database (54 Pathological Classes)
// const DISEASES = {
//   apple_scab: {
//     crop: { en: "Apple", hi: "सेब", mr: "सफरचंद" },
//     diseaseName: {
//       en: "Apple Scab (Venturia inaequalis)",
//       hi: "सेब का स्कैब (Venturia inaequalis)",
//       mr: "सफरचंद स्कॅब (Venturia inaequalis)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Olive-green to dull black velvety spots on leaf blades.",
//         "Deformed, corky, and cracked fruit surfaces.",
//         "Premature defoliation during prolonged leaf wetness.",
//       ],
//       hi: [
//         "पत्तियों पर जैतून-हरे से काले मखमली धब्बे।",
//         "फलों का आकार बिगड़ना और पपड़ीदार होकर फटना।",
//         "लंबे समय तक पत्तियां गीली रहने पर समय से पहले गिरना।",
//       ],
//       mr: [
//         "पानांवर हिरवट-काळी मखमली खपली तयार होते.",
//         "फळांचा आकार बिघडतो आणि फळे तडकतात.",
//         "पाने जास्त वेळ ओली राहिल्यास अकाली गळतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Rake up and destroy fallen leaf litter to halt ascospore maturation.",
//         ],
//         hi: [
//           "बीजाणुओं को रोकने के लिए गिरे हुए पत्तों को इकट्ठा कर नष्ट करें।",
//         ],
//         mr: [
//           "बुरशीचे बीजाणू नष्ट करण्यासाठी खाली पडलेला पालापाचोळा जाळून टाका.",
//         ],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "5% Urea Foliar Wash",
//             dosage: "50 g/L",
//             applicationMethod: "Spray on fallen autumn leaves",
//           },
//         ],
//         hi: [
//           {
//             name: "5% यूरिया का छिड़काव",
//             dosage: "50 ग्राम/लीटर",
//             applicationMethod: "गिरे हुए पत्तों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "५% युरिया फवारणी",
//             dosage: "५० ग्रॅम/लिटर",
//             applicationMethod: "जमिनीवरील पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Captan 50% WP or Mancozeb 75% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Canopy protective spray at green tip stage",
//           },
//           {
//             name: "Difenoconazole 25% EC",
//             dosage: "0.3 ml/L",
//             applicationMethod: "Curative spray within 72 hours of rain",
//           },
//         ],
//         hi: [
//           {
//             name: "कैप्टान 50% WP या मैंकोजेब 75% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "सुरक्षात्मक छिड़काव",
//           },
//           {
//             name: "डिफेनोकोनाज़ोल 25% EC",
//             dosage: "0.3 मिली/लीटर",
//             applicationMethod: "बारिश के 72 घंटे के भीतर उपचारात्मक छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॅप्टन ५०% WP किंवा मँकोझेब ७५% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "प्रतिबंधात्मक फवारणी",
//           },
//           {
//             name: "डिफेनोकोनॅझोल २५% EC",
//             dosage: "०.३ मिली/लिटर",
//             applicationMethod: "पावसानंतर ७२ तासांच्या आत फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Prune trees to allow sunlight and rapid wind drying of foliage.",
//         "Plant scab-resistant cultivars.",
//       ],
//       hi: [
//         "हवा और धूप के लिए पेड़ों की उचित छंटाई करें।",
//         "रोग प्रतिरोधी किस्में लगाएं।",
//       ],
//       mr: [
//         "हवा खेळती राहण्यासाठी झाडांची योग्य छाटणी करा.",
//         "प्रतिकारक वाणांची लागवड करा.",
//       ],
//     },
//   },

//   apple_black_rot: {
//     crop: { en: "Apple", hi: "सेब", mr: "सफरचंद" },
//     diseaseName: {
//       en: "Black Rot (Diplodia seriata)",
//       hi: "काला सड़न रोग (Diplodia seriata)",
//       mr: "काळी सड (Diplodia seriata)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Frog-eye leaf spots with purple margins and tan centers.",
//         "Firm brown-to-black rotting patches on fruit turning into black mummies.",
//         "Sunken reddish-brown cankers on branches.",
//       ],
//       hi: [
//         "पत्तियों पर बैंगनी किनारों वाले मेंढक की आंख जैसे धब्बे।",
//         "फलों पर काले रंग का सड़न घेरा जो फलों को सुखाकर काला कर देता है।",
//         "शाखाओं पर लाल-भूरे रंग के धंसे हुए घाव।",
//       ],
//       mr: [
//         "पानांवर जांभळ्या कडांचे गोलाकार डाग.",
//         "फळांवर काळी सड होऊन फळे सुकून काळी पडतात.",
//         "फांद्यांवर व्रण (Cankers) तयार होतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Prune cankered wood at least 15 cm below diseased margins during dry weather.",
//         ],
//         hi: ["संक्रमित टहनियों और सड़े हुए फलों को तुरंत काटकर नष्ट करें।"],
//         mr: ["रोगट फांद्या निरोगी भागापासून १५ सेमी खाली छाटून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Early season foliar barrier spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Thiophanate-methyl 70% WP",
//             dosage: "1.0 g/L",
//             applicationMethod:
//               "Apply from petal fall through fruit development",
//           },
//         ],
//         hi: [
//           {
//             name: "थियोफैनिट-मिथाइल 70% WP",
//             dosage: "1 ग्राम/लीटर",
//             applicationMethod: "फूल खिलने के बाद छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "थायोफॅनेट मिथाईल ७०% WP",
//             dosage: "१ ग्रॅम/लिटर",
//             applicationMethod: "पाकळ्या गळल्यानंतर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Remove mummified fruit hanging from canopy during winter pruning.",
//         "Avoid bark injuries.",
//       ],
//       hi: [
//         "पेड़ों की छाल को कटने-छिलने से बचाएं।",
//         "पेड़ों पर लटके सूखे फलों को हटाएं।",
//       ],
//       mr: [
//         "झाडांवर राहिलेली सडलेली फळे काढून टाका.",
//         "खोडाला जखमा होऊ देऊ नका.",
//       ],
//     },
//   },

//   apple_cedar_apple_rust: {
//     crop: { en: "Apple", hi: "सेब", mr: "सफरचंद" },
//     diseaseName: {
//       en: "Cedar Apple Rust (Gymnosporangium)",
//       hi: "सीडर एप्पल रस्ट (Gymnosporangium)",
//       mr: "सिडार ॲपल रस्ट (Gymnosporangium)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Bright yellow-orange spots on upper leaf surface.",
//         "Cylindrical spore tubes (aecia) forming on lower leaf surface.",
//         "Orange spots on fruit causing calyx distortion.",
//       ],
//       hi: [
//         "पत्ती की ऊपरी सतह पर चमकीले नारंगी-पीले धब्बे।",
//         "पत्ती के नीचे नली जैसी बीजाणु संरचनाएं।",
//         "फलों पर नारंगी धब्बे।",
//       ],
//       mr: [
//         "पानांच्या वरच्या बाजूला केशरी-पिवळे डाग.",
//         "पानांच्या खालच्या बाजूला बारीक नळीसारखी वाढ.",
//         "फळांवर डाग पडून आकार बिघडणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Remove nearby wild red cedar or juniper galls within 500 meters.",
//         ],
//         hi: [
//           "बगीचे के 500 मीटर के दायरे से जूनिपर के पौधों की गिल्टियां हटाएं।",
//         ],
//         mr: ["बागेजवळील जुनिपर झाडांवरील गाठी नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Wettable Sulfur 80% WP",
//             dosage: "3.0 g/L",
//             applicationMethod: "Foliar cover spray starting at pink bud",
//           },
//         ],
//         hi: [
//           {
//             name: "सल्फर (गंधक) पाउडर",
//             dosage: "3 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "पाण्यात विरघळणारे गंधक",
//             dosage: "३ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Myclobutanil 10% WP",
//             dosage: "1.0 g/L",
//             applicationMethod: "Foliar spray at pink bud stage",
//           },
//         ],
//         hi: [
//           {
//             name: "माइक्लोब्यूटानिल 10% WP",
//             dosage: "1 ग्राम/लीटर",
//             applicationMethod: "कली अवस्था में छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मायक्लोब्युटॅनिल १०% WP",
//             dosage: "१ ग्रॅम/लिटर",
//             applicationMethod: "कळ्यांच्या अवस्थेत फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Eliminate wild junipers near orchards.",
//         "Choose rust-tolerant rootstocks.",
//       ],
//       hi: [
//         "बगीचे के पास जंगली जूनिपर न उगने दें।",
//         "रोगरोधी किस्मों का चयन करें।",
//       ],
//       mr: ["बागेजवळ जुनिपरची झाडे ठेवू नका.", "तांबेरा प्रतिकारक वाण लावा."],
//     },
//   },

//   cashew_leaf_miner: {
//     crop: { en: "Cashew", hi: "काजू", mr: "काजू" },
//     diseaseName: {
//       en: "Cashew Leaf Miner (Acrocercops syngramma)",
//       hi: "काजू लीफ माइनर (Acrocercops syngramma)",
//       mr: "काजूवरील नागअळी (Acrocercops syngramma)",
//     },
//     pathogenType: "Pest",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Silvery serpentine blister-like mines on tender leaves.",
//         "Dry, curled, and papery new leaves.",
//         "Stunted vegetative terminals post-monsoon.",
//       ],
//       hi: [
//         "कोमल पत्तियों पर चांदी जैसी टेढ़ी-मेढ़ी सुरंगें।",
//         "पत्तियों का सूखना, मुड़ना और पपड़ीदार होना।",
//         "नई शाखाओं का विकास रुकना।",
//       ],
//       mr: [
//         "कोवळ्या पानांवर नागमोडी चंदेरी रेषा व पापुद्रे दिसतात.",
//         "पाने वाळतात आणि चुरडतात.",
//         "नवीन पालवीची वाढ खुंटते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune and burn heavily infested tender shoots."],
//         hi: ["कीटग्रस्त कोमल शाखाओं को काटकर नष्ट करें।"],
//         mr: ["बाधित शेंडे छाटून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem Seed Kernel Extract (NSKE) 5%",
//             dosage: "50 ml/L",
//             applicationMethod: "Canopy flush spray",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम बीज अर्क (NSKE 5%)",
//             dosage: "50 मिली/लीटर",
//             applicationMethod: "नई पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी अर्क ५%",
//             dosage: "५० मिली/लिटर",
//             applicationMethod: "पालवीवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Lambda-cyhalothrin 5% EC",
//             dosage: "0.6 ml/L",
//             applicationMethod: "Canopy spray when mines appear on >5% flush",
//           },
//         ],
//         hi: [
//           {
//             name: "लैम्ब्डा-साइहलोथ्रिन 5% EC",
//             dosage: "0.6 मिली/लीटर",
//             applicationMethod: "नई पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "लॅम्बडा-सायहॅलोथ्रीन ५% EC",
//             dosage: "०.६ मिली/लिटर",
//             applicationMethod: "झाडावर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Conserve eulophid parasitoid wasps.",
//         "Monitor early vegetative flush in post-monsoon.",
//       ],
//       hi: [
//         "परजीवी कीटों का संरक्षण करें।",
//         "मानसून के बाद नई पत्तियों की नियमित जांच करें।",
//       ],
//       mr: [
//         "नैसर्गिक परोपजीवी कीटकांचे संवर्धन करा.",
//         "पावसाळ्यानंतर नवीन पालवीवर लक्ष ठेवा.",
//       ],
//     },
//   },

//   cashew_red_rust: {
//     crop: { en: "Cashew", hi: "काजू", mr: "काजू" },
//     diseaseName: {
//       en: "Cashew Red Rust (Cephaleuros virescens)",
//       hi: "काजू रेड रस्ट / लाल रतुआ (Cephaleuros virescens)",
//       mr: "काजूवरील लाल तांबेरा (Cephaleuros virescens)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Circular orange-red velvety parasitic algae patches on leaves.",
//         "Twig bark cracking and stunted growth.",
//         "Impaired photosynthesis and localized chlorosis.",
//       ],
//       hi: [
//         "पत्तियों पर नारंगी-लाल मखमली गोल धब्बे।",
//         "टहनियों की छाल फटना और विकास रुकना।",
//         "पत्तियों का पीला पड़ना।",
//       ],
//       mr: [
//         "पानांवर नारंगी-लाल मखमली वर्तुळाकार ठिपके पडतात.",
//         "फांद्यांची साल तडकणे आणि वाढ खुंटणे.",
//         "पाने पिवळी पडणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Thin out dense shade branches to increase sunlight and aeration.",
//         ],
//         hi: ["धूप और हवा आने के लिए घनी शाखाओं की छंटाई करें।"],
//         mr: ["झाडांची गर्दी कमी करून सूर्यप्रकाश व हवा खेळती ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Bordeaux Mixture 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Even protective canopy wash",
//           },
//         ],
//         hi: [
//           {
//             name: "बोर्डो मिश्रण 1%",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "बोर्डो मिश्रण १%",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "झाडावर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Copper Oxychloride 50% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray pre- and post-monsoon",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर ऑक्सीक्लोराइड 50% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "मानसून से पहले और बाद में छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर ऑक्सिक्लोराईड ५०% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "पावसाळ्यापूर्वी व नंतर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Ensure orchard soil drainage.",
//         "Maintain balanced potassium nutrition.",
//       ],
//       hi: [
//         "बगीचे में जल निकासी दुरुस्त रखें।",
//         "पोटाश युक्त उर्वरक का संतुलित उपयोग करें।",
//       ],
//       mr: ["बागेमध्ये पाणी साचू देऊ नका.", "पालाश खताचा योग्य वापर करा."],
//     },
//   },

//   cassava_brown_spot: {
//     crop: { en: "Cassava", hi: "कसावा", mr: "कसाव्हा" },
//     diseaseName: {
//       en: "Brown Leaf Spot (Passalora henningsii)",
//       hi: "भूरा पत्ती धब्बा रोग (Passalora henningsii)",
//       mr: "तपकिरी पानांवरील डाग (Passalora henningsii)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Angular brown lesions bounded by leaf veins.",
//         "Severe premature leaf senescence on lower canopy.",
//         "Significant reduction in tuber bulking.",
//       ],
//       hi: [
//         "पत्तियों की नसों के बीच कोणीय भूरे धब्बे।",
//         "निचली पत्तियों का तेजी से सूखकर गिरना।",
//         "कंदों के विकास में भारी कमी।",
//       ],
//       mr: [
//         "पानांच्या शिरांमधील कोनीय तपकिरी डाग.",
//         "खालच्या पानांची अकाली गळती.",
//         "कंदांची वाढ खुंटणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Strip off diseased lower canopy leaves."],
//         hi: ["संक्रमित निचली पत्तियों को तोड़कर जला दें।"],
//         mr: ["खालची बाधित पाने तोडून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Trichoderma harzianum Biopesticide",
//             dosage: "5.0 g/L",
//             applicationMethod: "Preventive foliar wash",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइकोडर्मा हारजिएनम",
//             dosage: "5 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायकोडर्मा हार्झियानम",
//             dosage: "५ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray every 14 days in humid weather",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "14 दिन के अंतराल पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब ७५% WP",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "दर १४ दिवसांनी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Maintain 1m x 1m field spacing.",
//         "Plant disease-free stem cuttings.",
//       ],
//       hi: [
//         "पौधों के बीच 1x1 मीटर की दूरी रखें।",
//         "रोगमुक्त तने की कलमें ही लगाएं।",
//       ],
//       mr: ["रोपांमध्ये १x१ मीटर अंतर ठेवा.", "निरोगी बेण्यांचीच लागवड करा."],
//     },
//   },

//   cassava_mosaic: {
//     crop: { en: "Cassava", hi: "कसावा", mr: "कसाव्हा" },
//     diseaseName: {
//       en: "Cassava Mosaic Geminivirus (CMD)",
//       hi: "कसावा मोजेक वायरस (CMD)",
//       mr: "कसाव्हा मोझॅक व्हायरस (CMD)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Severe mosaic mottle with yellow-green chlorosis.",
//         "Deformed, twisted, and distorted leaflets.",
//         "Stunted growth and minimal root tuber yield.",
//       ],
//       hi: [
//         "पत्तियों पर पीले और गहरे हरे रंग के चितकबरे मोजेक धब्बे।",
//         "पत्तियों का विकृत और मुड़ा होना।",
//         "पौधे का बौना होना और कंद न बनना।",
//       ],
//       mr: [
//         "पानांवर पिवळसर-हिरवे चट्टे पडणे.",
//         "पाने आक्रसणे आणि वेडीवाकडी होणे.",
//         "झाडाची वाढ खुंटणे व कंद न भरणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Uproot and burn diseased plants immediately (roguing)."],
//         hi: ["रोगग्रस्त पौधों को तुरंत उखाड़कर नष्ट करें।"],
//         mr: ["बाधित झाडे त्वरित उपटून जाळून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Yellow Sticky Traps & Neem Oil",
//             dosage: "15 traps/acre | 5 ml/L",
//             applicationMethod: "Whitefly vector management",
//           },
//         ],
//         hi: [
//           {
//             name: "पीले स्टिकी ट्रैप और नीम का तेल",
//             dosage: "15 ट्रैप/एकड़ | 5 मिली/लीटर",
//             applicationMethod: "सफेद मक्खी नियंत्रण",
//           },
//         ],
//         mr: [
//           {
//             name: "पिवळे चिकट सापळे आणि निंबोळी तेल",
//             dosage: "१५ सापळे/एकर | ५ मिली/लिटर",
//             applicationMethod: "पांढऱ्या माशीचे नियंत्रण",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Thiamethoxam 25% WG",
//             dosage: "0.3 g/L",
//             applicationMethod: "Spray targeting whitefly vectors",
//           },
//         ],
//         hi: [
//           {
//             name: "थियामेथोक्सम 25% WG",
//             dosage: "0.3 ग्राम/लीटर",
//             applicationMethod: "सफेद मक्खी को मारने के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "थायमेथॉक्झाम २५% WG",
//             dosage: "०.३ ग्रॅम/लिटर",
//             applicationMethod: "पांढऱ्या माशीसाठी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Use tissue-culture certified disease-free stem cuttings.",
//         "Plant resistant cultivars.",
//       ],
//       hi: [
//         "प्रमाणित रोगमुक्त तने की कलमें ही लगाएं।",
//         "प्रतिरोधी किस्में चुनें।",
//       ],
//       mr: ["प्रमाणित निरोगी बेण्यांचाच वापर करा.", "प्रतिकारक वाण लावा."],
//     },
//   },

//   cherry_powdery_mildew: {
//     crop: { en: "Cherry", hi: "चेरी", mr: "चेरी" },
//     diseaseName: {
//       en: "Cherry Powdery Mildew (Podosphaera clandestina)",
//       hi: "चेरी चूर्णिल आसिता (Podosphaera clandestina)",
//       mr: "चेरी भुरी रोग (Podosphaera clandestina)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "White powdery fungal patches on young terminal leaves.",
//         "Upward cupping, puckering, and twisting of shoots.",
//         "Web-like fungal mycelium on ripening cherries.",
//       ],
//       hi: [
//         "नई कोमल पत्तियों पर सफेद पाउडर जैसी फफूंद।",
//         "पत्तियों का ऊपर की ओर मुड़ना और सिकुड़ना।",
//         "पकते हुए फलों पर जाले जैसी फफूंद।",
//       ],
//       mr: [
//         "नवीन कोवळ्या पानांवर पांढऱ्या पावडरीसारखी बुरशी.",
//         "पाने वरच्या बाजूला वळणे आणि चुरडणे.",
//         "पिकणाऱ्या फळांवर बुरशीचे जाळे तयार होणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune dense sucker shoots harboring fungal mycelium."],
//         hi: ["संक्रमित कोमल शाखाओं और वाटर स्प्राउट्स को काटें।"],
//         mr: ["बुरशी लागलेली पालवी आणि अनावश्यक धुमारे छाटा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Potassium Bicarbonate",
//             dosage: "3.0 g/L",
//             applicationMethod: "Foliar spray to alter leaf pH",
//           },
//         ],
//         hi: [
//           {
//             name: "पोटेशियम बाइकार्बोनेट",
//             dosage: "3 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "पोटॅशियम बायकार्बोनेट",
//             dosage: "३ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Hexaconazole 5% EC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar application at petal fall",
//           },
//         ],
//         hi: [
//           {
//             name: "हेक्साकोनाज़ोल 5% EC",
//             dosage: "1 मिली/लीटर",
//             applicationMethod: "फूल गिरने के बाद छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "हेक्झाकोनॅझोल ५% EC",
//             dosage: "१ मिली/लिटर",
//             applicationMethod: "पाकळ्या गळल्यानंतर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid excessive nitrogen fertilizers.",
//         "Open canopy to promote low humidity.",
//       ],
//       hi: [
//         "अत्यधिक यूरिया का उपयोग न करें।",
//         "हवा के संचार के लिए पेड़ की छंटाई करें।",
//       ],
//       mr: [
//         "नत्रयुक्त खतांचा अतिवापर टाळा.",
//         "झाडामध्ये सूर्यप्रकाश खेळता ठेवा.",
//       ],
//     },
//   },

//   chilli_nutrition_deficiency: {
//     crop: { en: "Chilli", hi: "मिर्च", mr: "मिरची" },
//     diseaseName: {
//       en: "Nutrient Deficiency (N/P/K & Micronutrients)",
//       hi: "पोषक तत्वों की कमी",
//       mr: "अन्नद्रव्यांची कमतरता",
//     },
//     pathogenType: "Deficiency",
//     severityLevel: "Low",
//     symptoms: {
//       en: [
//         "Interveinal chlorosis, pale leaves, and stunted internodes.",
//         "Premature blossom and fruit drop.",
//         "Upward or downward leaf cupping without viral enations.",
//       ],
//       hi: [
//         "पत्तियों की नसों के बीच पीलापन और पौधे का बौना होना।",
//         "फूलों और छोटे फलों का असमय गिरना।",
//         "पत्तियों का मुड़ना लेकिन नसों पर उभार न होना।",
//       ],
//       mr: [
//         "पानांच्या शिरांमधील भाग पिवळा पडणे आणि वाढ खुंटणे.",
//         "फुले व लहान फळे अकाली गळणे.",
//         "पाने आकसणे परंतु त्यावर गाठी नसणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Check soil EC and pH to identify root nutrient lockout."],
//         hi: ["मिट्टी की जांच कराएं और अतिरिक्त पानी निकालें।"],
//         mr: ["मातीचे परीक्षण करून घ्या आणि पाण्याचा योग्य निचरा करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Fermented Jeevamrutha or Vermicompost Extract",
//             dosage: "10% solution",
//             applicationMethod: "Root zone drench",
//           },
//         ],
//         hi: [
//           {
//             name: "जीवामृत या वर्मीकम्पोस्ट अर्क",
//             dosage: "10% घोल",
//             applicationMethod: "जड़ों में दें",
//           },
//         ],
//         mr: [
//           {
//             name: "जीवामृत किंवा गांडूळ खताचा अर्क",
//             dosage: "१०% द्रावण",
//             applicationMethod: "मुळांशी आळवणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "19:19:19 NPK + Chelated Micronutrients",
//             dosage: "5.0 g/L",
//             applicationMethod: "Foliar spray twice at 10-day intervals",
//           },
//         ],
//         hi: [
//           {
//             name: "19:19:19 NPK + सूक्ष्म पोषक तत्व",
//             dosage: "5 ग्राम/लीटर",
//             applicationMethod: "10 दिन के अंतराल पर 2 बार छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "१९:१९:१९ NPK + सूक्ष्म अन्नद्रव्ये",
//             dosage: "५ ग्रॅम/लिटर",
//             applicationMethod: "१० दिवसांच्या अंतराने २ वेळा फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Apply well-rotted FYM (10 tons/acre) at preparatory ploughing.",
//         "Conduct soil health tests.",
//       ],
//       hi: [
//         "बुआई से पहले 10 टन सड़ी गोबर खाद डालें।",
//         "मृदा स्वास्थ्य कार्ड अनुसार खाद दें।",
//       ],
//       mr: [
//         "लागवडीपूर्वी एकरी १० टन चांगले कुजलेले शेणखत द्या.",
//         "माती परीक्षणानुसार खते द्या.",
//       ],
//     },
//   },

//   chilli_white_spot: {
//     crop: { en: "Chilli", hi: "मिर्च", mr: "मिरची" },
//     diseaseName: {
//       en: "White Spot / Cercospora Leaf Spot (Cercospora capsici)",
//       hi: "मिर्च का सफेद धब्बा रोग (Cercospora capsici)",
//       mr: "मिरचीवरील पांढरे ठिपके (Cercospora capsici)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Circular leaf spots with bleached whitish centers and dark brown halos.",
//         "Severe defoliation under high humidity.",
//         "Reduced fruit setting and sunscald.",
//       ],
//       hi: [
//         "सफेद केंद्र और गहरे लाल-भूरे घेरे वाले गोल धब्बे।",
//         "नमी होने पर पत्तियों का तेजी से गिरना।",
//         "फलों के बनने में भारी कमी।",
//       ],
//       mr: [
//         "पानांवर पांढऱ्या केंद्राचे आणि तपकिरी कडांचे गोलाकार ठिपके.",
//         "जास्त आर्द्रतेमध्ये पाने पिवळी पडून गळतात.",
//         "फळधारणा कमी होते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Collect and burn fallen spotted leaves."],
//         hi: ["गिरी हुई संक्रमित पत्तियों को इकट्ठा कर जलाएं।"],
//         mr: ["गळून पडलेली रोगट पाने गोळा करून जाळून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Pseudomonas fluorescens 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "स्यूडोमोनास फ्लोरोसेंस 1%",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "सुडोमोनास फ्लोरोसन्स १%",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Chlorothalonil 75% WP or Mancozeb 75% WP",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray every 10-14 days",
//           },
//         ],
//         hi: [
//           {
//             name: "क्लोरोथालोनिल 75% WP या मैंकोजेब 75% WP",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "10-14 दिनों के अंतराल पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "क्लोरोथालोनील ७५% WP किंवा मँकोझेब",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "१०-१४ दिवसांच्या अंतराने फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Hot water seed treatment at 52°C for 10 min.",
//         "Avoid overhead irrigation.",
//       ],
//       hi: [
//         "बीज को 52°C गर्म पानी में 10 मिनट उपचारित करें।",
//         "ऊपर से पानी देने से बचें।",
//       ],
//       mr: [
//         "पेरणीपूर्वी बियाणांवर ५२°C तापमानाच्या पाण्याची प्रक्रिया करा.",
//         "तुषार सिंचन टाळा.",
//       ],
//     },
//   },

//   citrus_black_spot: {
//     crop: { en: "Citrus", hi: "नींबू वर्गीय", mr: "लिंबूवर्गीय" },
//     diseaseName: {
//       en: "Citrus Black Spot (Phyllosticta citricarpa)",
//       hi: "सिट्रस ब्लैक स्पॉट (Phyllosticta citricarpa)",
//       mr: "लिंबूवरील काळे डाग (Phyllosticta citricarpa)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Hard-spot crater lesions with grey depressed centers on fruit rinds.",
//         "Small reddish-brown circular spots on mature leaves.",
//         "Premature fruit drop.",
//       ],
//       hi: [
//         "फलों के छिलके पर धंसे हुए केंद्र वाले काले-भूरे गड्ढे।",
//         "पुरानी पत्तियों पर छोटे लाल-भूरे गोल धब्बे।",
//         "फलों का असमय गिरना।",
//       ],
//       mr: [
//         "फळांच्या सालीवर खोलगट काळे ठिपके पडतात.",
//         "पानांवर लहान लालसर-तपकिरी डाग दिसतात.",
//         "फळे अकाली गळून पडतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Mulch fallen leaves to inhibit ascospore discharge."],
//         hi: ["पेड़ों के नीचे गिरे पत्तों को ढकें या नष्ट करें।"],
//         mr: ["गळून पडलेली पाने गोळा करून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.5 g/L",
//             applicationMethod: "Pre-monsoon canopy cover spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "मानसून से पहले छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "पावसाळ्यापूर्वी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Azoxystrobin 23% SC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar spray at 2/3 petal fall",
//           },
//         ],
//         hi: [
//           {
//             name: "एज़ोक्सीस्ट्रोबिन 23% SC",
//             dosage: "1.0 मिली/लीटर",
//             applicationMethod: "फूल झड़ने के बाद छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "अझॉक्सीस्ट्रॉबिन २३% SC",
//             dosage: "१.० मिली/लिटर",
//             applicationMethod: "पाकळ्या गळल्यानंतर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Prune dead twigs annually.", "Harvest mature fruit without delay."],
//       hi: ["सूखी टहनियों की नियमित छंटाई करें।", "फलों की समय पर तुड़ाई करें।"],
//       mr: ["वाळलेल्या फांद्या छाटून काढा.", "फळे वेळेवर तोडा."],
//     },
//   },

//   citrus_canker: {
//     crop: { en: "Citrus", hi: "नींबू वर्गीय", mr: "लिंबूवर्गीय" },
//     diseaseName: {
//       en: "Citrus Canker (Xanthomonas citri)",
//       hi: "सिट्रस कैंकर (Xanthomonas citri)",
//       mr: "खैऱ्या रोग / सायट्रस कॅंकर (Xanthomonas citri)",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Raised, corky, rough lesions surrounded by a yellow halo on leaves.",
//         "Craters on fruits rendering them unmarketable.",
//         "Twig cankers causing dieback.",
//       ],
//       hi: [
//         "पत्तियों और फलों पर खुरदरे, उभरे हुए कॉर्क जैसे धब्बे और पीला घेरा।",
//         "फलों पर गहरे गड्ढे।",
//         "टहनियों का सूखना (Dieback)।",
//       ],
//       mr: [
//         "पाने व फळांवर खरबरीत तपकिरी खपलीसारखे डाग आणि पिवळे वलय.",
//         "फळांवर खोलगट व्रण.",
//         "फांद्या शेंड्याकडून वाळणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune cankered twigs during dormancy and incinerate them."],
//         hi: ["संक्रमित टहनियों को काटकर तुरंत जला दें।"],
//         mr: ["रोगग्रस्त फांद्या छाटून जाळून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem Seed Kernel Extract 5%",
//             dosage: "50 ml/L",
//             applicationMethod: "Foliar spray to deter leaf miner",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम बीज अर्क 5%",
//             dosage: "50 मिली/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी अर्क ५%",
//             dosage: "५० मिली/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Streptocycline 100 ppm + Copper Oxychloride 50% WP",
//             dosage: "1 g Streptocycline + 30 g COC per 10 L",
//             applicationMethod: "Foliar spray at 15-day intervals",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 1 ग्राम + कॉपर ऑक्सीक्लोराइड 30 ग्राम (10L पानी)",
//             dosage: "1g+30g/10L",
//             applicationMethod: "15 दिन के अंतराल पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन १ ग्रॅम + कॉपर ऑक्सिक्लोराईड ३० ग्रॅम / १० लिटर",
//             dosage: "१g+३०g/१०L",
//             applicationMethod: "१५ दिवसांच्या अंतराने फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Use disease-free nursery stock.",
//         "Install windbreaks around orchards.",
//       ],
//       hi: [
//         "प्रमाणित रोगमुक्त नर्सरी पौधों का उपयोग करें।",
//         "बागे के चारों ओर हवा-रोधी पेड़ लगाएं।",
//       ],
//       mr: [
//         "रोगमुक्त रोपांचीच लागवड करा.",
//         "बागेभोवती वारा प्रतिबंधक झाडे लावा.",
//       ],
//     },
//   },

//   maize_cercospora_gray_leaf_spot: {
//     crop: { en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//     diseaseName: {
//       en: "Gray Leaf Spot (Cercospora zeae-maydis)",
//       hi: "ग्रे लीफ स्पॉट / धूसर पत्ती धब्बा",
//       mr: "राखाडी पानांवरील ठिपके",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Rectangular gray to tan lesions delimited strictly by leaf veins.",
//         "Blighting of leaf canopy leading to poor ear fill.",
//         "Premature stalk lodging.",
//       ],
//       hi: [
//         "पत्तियों की नसों के बीच आयताकार धूसर-भूरे धब्बे।",
//         "पत्तियों का झुलसना और भुट्टे में दाने न भरना।",
//         "तने का कमजोर होकर गिरना।",
//       ],
//       mr: [
//         "पानांच्या शिरांनुसार लांबट आयताकृती राखाडी डाग.",
//         "पाने करपल्यामुळे कणसात दाणे न भरणे.",
//         "ताटे कमकुवत होऊन कोलमडणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Avoid high density planting to improve canopy airflow."],
//         hi: ["हवा के बहाव के लिए पौधों के बीच पर्याप्त दूरी रखें।"],
//         mr: ["पिकात हवा खेळती राहील असे योग्य अंतर ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Bacillus subtilis Bio-fungicide",
//             dosage: "5.0 g/L",
//             applicationMethod: "Foliar spray prior to tassel emergence",
//           },
//         ],
//         hi: [
//           {
//             name: "बैसिलस सबटिलिस जैव-कवकनाशी",
//             dosage: "5 ग्राम/लीटर",
//             applicationMethod: "मंजरी निकलने से पहले छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "बॅसिलस सबटिलिस जैविक बुरशीनाशक",
//             dosage: "५ ग्रॅम/लिटर",
//             applicationMethod: "तुरा येण्यापूर्वी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Pyraclostrobin 20% WG",
//             dosage: "1.0 g/L",
//             applicationMethod:
//               "Foliar spray at first sign of lesion progression",
//           },
//         ],
//         hi: [
//           {
//             name: "पाइराक्लोस्ट्रोबिन 20% WG",
//             dosage: "1 ग्राम/लीटर",
//             applicationMethod: "लक्षण दिखते ही छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "पायराक्लोस्ट्रोबिन २०% WG",
//             dosage: "१ ग्रॅम/लिटर",
//             applicationMethod: "डाग दिसताच फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Rotate corn with non-host legumes.",
//         "Deeply plough and bury corn residues.",
//       ],
//       hi: [
//         "दलहनी फसलों के साथ फसल चक्र अपनाएं।",
//         "फसल अवशेषों को मिट्टी में गहराई से दबाएं।",
//       ],
//       mr: [
//         "कडधान्य पिकांसोबत फेरपालट करा.",
//         "कापणीनंतर पिकाचे अवशेष खोल नांगरून गाडा.",
//       ],
//     },
//   },

//   maize_common_rust: {
//     crop: { en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//     diseaseName: {
//       en: "Common Rust (Puccinia sorghi)",
//       hi: "कॉमन रस्ट / सामान्य रतुआ",
//       mr: "मक्यावरील तांबेरा",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Low",
//     symptoms: {
//       en: [
//         "Golden-brown to cinnamon-brown powdery pustules on both leaf surfaces.",
//         "Pustules rupture epidermal tissue releasing reddish spores.",
//         "Chlorosis surrounding pustule clusters.",
//       ],
//       hi: [
//         "पत्ती की दोनों सतहों पर दालचीनी-भूरे रंग के पाउडर जैसे फफोले।",
//         "फफोले फटने पर लाल-भूरा पाउडर निकलता है।",
//         "फफोलों के चारों ओर पीलापन।",
//       ],
//       mr: [
//         "पानांच्या दोन्ही बाजूंना तांबूस-तपकिरी रंगाचे भुकटीयुक्त पुरळ.",
//         "पुरळ फुटून लालसर बीजाणू बाहेर पडतात.",
//         "पुरळांच्या भोवती पिवळे डाग.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Scout field borders during cool, humid weather."],
//         hi: ["मौसम ठंडा और नम होने पर खेत के किनारों की जांच करें।"],
//         mr: ["हवामानात गारवा व आर्द्रता असताना पिकाची पाहणी करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Fermented Buttermilk foliar wash",
//             dosage: "5 L/acre in water",
//             applicationMethod: "Morning spray",
//           },
//         ],
//         hi: [
//           {
//             name: "खट्टी छाछ का घोल",
//             dosage: "5 लीटर/एकड़",
//             applicationMethod: "सुबह छिड़काव करें",
//           },
//         ],
//         mr: [
//           {
//             name: "आंबट ताक",
//             dosage: "५ लिटर/एकर",
//             applicationMethod: "सकाळी फवारणी करा",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar spray if rust appears before silking",
//           },
//         ],
//         hi: [
//           {
//             name: "एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल",
//             dosage: "1 मिली/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "अझॉक्सीस्ट्रॉबिन + डिफेनोकोनॅझोल",
//             dosage: "१ मिली/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Plant rust-tolerant hybrid corn seed.", "Sow early in the season."],
//       hi: ["रोगरोधी संकर किस्मों की बुआई करें।", "समय पर अगेती बुआई करें।"],
//       mr: [
//         "तांबेरा प्रतिकारक संकरित वाण वापरा.",
//         "हंगामाच्या सुरुवातीला लवकर पेरणी करा.",
//       ],
//     },
//   },

//   maize_northern_leaf_blight: {
//     crop: { en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//     diseaseName: {
//       en: "Northern Leaf Blight (Exserohilum turcicum)",
//       hi: "उत्तरी पत्ती झुलसा (NLB)",
//       mr: "मोठा करपा / नॉर्दर्न लीफ ब्लाइट",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Large, elongated, cigar-shaped grayish-green lesions (up to 15 cm).",
//         "Lesions turn tan with dark olive sporulation in damp weather.",
//         "Extensive canopy scorch.",
//       ],
//       hi: [
//         "पत्तियों पर बड़े, सिगार के आकार के भूरे-धूसर धब्बे (15 सेमी तक लंबे)।",
//         "धब्बों पर जैतून रंग की फफूंद बनना।",
//         "पत्तियों का जलना और सूखना।",
//       ],
//       mr: [
//         "पानांवर लांबट सिगारेटच्या आकाराचे करपलेले मोठे पट्टे (१५ सेमीपर्यंत).",
//         "दमट हवेत पट्ट्यांवर काळपट बुरशी तयार होते.",
//         "झाडाची पाने जळाल्यासारखी होतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Disrupt field residue to minimize fungal sporulation."],
//         hi: ["संक्रमित पत्तियों को खेत से हटाकर नष्ट करें।"],
//         mr: ["बाधित पिकाचे अवशेष गोळा करून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Trichoderma viride 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइकोडर्मा विरिडी 1%",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायकोडर्मा व्हिरिडी १%",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray every 10 days",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "10 दिन के अंतराल पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब ७५% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "दर १० दिवसांनी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Rotate corn with non-grass crops.",
//         "Plow under crop stubble after harvest.",
//       ],
//       hi: [
//         "गैर-घास फसलों के साथ फसल चक्र अपनाएं।",
//         "कटाई के बाद गहरी जुताई करें।",
//       ],
//       mr: ["इतर पिकांसोबत फेरपालट करा.", "कापणीनंतर जमिनीची खोल नांगरट करा."],
//     },
//   },

//   cotton_bacterial_blight: {
//     crop: { en: "Cotton", hi: "कपास", mr: "कापूस" },
//     diseaseName: {
//       en: "Bacterial Blight / Angular Leaf Spot (Xanthomonas malvacearum)",
//       hi: "कपास का जीवाणु झुलसा / कोणीय पत्ती धब्बा",
//       mr: "कापसावरील जिवाणू करपा (Angular Leaf Spot)",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Angular, water-soaked lesions bounded by leaf veins.",
//         "Black arm on stems and petioles.",
//         "Internal boll rot and stained lint.",
//       ],
//       hi: [
//         "पत्तियों पर नसों से घिरे कोणीय भीगे हुए धब्बे।",
//         "तने और टहनियों का काला पड़ना (Black arm)।",
//         "कपास के टिंडों का सड़ना और रुई खराब होना।",
//       ],
//       mr: [
//         "पानांच्या शिरांमधील कोनीय तेलकट ठिपके.",
//         "फांद्या आणि देठ काळे पडणे (Black arm).",
//         "बोंडे सडणे आणि कापूस खराब होणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Rogue out infected seedlings early in the season."],
//         hi: ["शुरुआत में ही संक्रमित पौधों को उखाड़कर नष्ट करें।"],
//         mr: ["सुरुवातीच्या काळातच रोगट रोपे उपटून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Streptocycline 100 ppm + Copper Oxychloride 50% WP",
//             dosage: "1 g Streptocycline + 30 g COC per 10 L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 1 ग्राम + कॉपर ऑक्सीक्लोराइड 30 ग्राम (10L)",
//             dosage: "1g+30g/10L",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन १ ग्रॅम + कॉपर ऑक्सिक्लोराईड ३० ग्रॅम / १० लिटर",
//             dosage: "१g+३०g/१०L",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Acid delinting of cotton seeds before sowing.",
//         "Plant blight-resistant Bt-cotton hybrids.",
//       ],
//       hi: [
//         "सल्फ्यूरिक एसिड से बीजोपचार (Acid Delinting) करें।",
//         "रोगरोधी बीटी कपास की किस्में लगाएं।",
//       ],
//       mr: [
//         "लागवडीपूर्वी ॲसिडने बियाणे प्रक्रिया (Delinting) करा.",
//         "करपा प्रतिबंधक वाण वापरा.",
//       ],
//     },
//   },

//   cotton_curl_virus: {
//     crop: { en: "Cotton", hi: "कपास", mr: "कापूस" },
//     diseaseName: {
//       en: "Cotton Leaf Curl Virus (CLCuVD)",
//       hi: "कपास लीफ कर्ल वायरस (मरोड़िया रोग)",
//       mr: "कापसावरील चुरडा-मुरडा रोग (Leaf Curl Virus)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Upward curling of leaves and vein thickening.",
//         "Enations (leaf-like outgrowths) on leaf undersides.",
//         "Stunted growth and boll abortion.",
//       ],
//       hi: [
//         "पत्तियों का ऊपर मुड़ना और नसों का मोटा होना।",
//         "पत्तियों के नीचे कप जैसी संरचनाएं बनना।",
//         "पौधे का बौना होना और टिंडे न बनना।",
//       ],
//       mr: [
//         "पाने वरच्या बाजूला वळणे आणि शिरा जाड होणे.",
//         "पानाच्या खाली गाठी किंवा पानासारखी वाढ तयार होणे.",
//         "वाढ खुंटणे आणि बोंडे गळणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Uproot infected plants before 45 days after sowing."],
//         hi: ["बुआई के 45 दिनों के भीतर संक्रमित पौधों को उखाड़कर नष्ट करें।"],
//         mr: ["पेरणीनंतर ४५ दिवसांच्या आत बाधित रोपे उपटून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Yellow sticky traps & Neem oil (10,000 ppm)",
//             dosage: "15 traps/acre | 3 ml/L",
//             applicationMethod: "Whitefly management",
//           },
//         ],
//         hi: [
//           {
//             name: "पीले स्टिकी ट्रैप और नीम का तेल",
//             dosage: "15 ट्रैप/एकड़ | 3 मिली/लीटर",
//             applicationMethod: "सफेद मक्खी नियंत्रण",
//           },
//         ],
//         mr: [
//           {
//             name: "पिवळे चिकट सापळे आणि निंबोळी तेल",
//             dosage: "१५ सापळे/एकर | ३ मिली/लिटर",
//             applicationMethod: "पांढऱ्या माशीचे नियंत्रण",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Diafenthiuron 50% WP or Flonicamid 50% WG",
//             dosage: "1.5 g/L or 0.3 g/L",
//             applicationMethod: "Foliar spray targeting whitefly",
//           },
//         ],
//         hi: [
//           {
//             name: "डायफेनथियूरॉन 50% WP या फ्लोनिकामिड",
//             dosage: "1.5 ग्राम/लीटर या 0.3 ग्राम/लीटर",
//             applicationMethod: "सफेद मक्खी पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डायफेनथियुरॉन ५०% WP किंवा फ्लोनिकामिड",
//             dosage: "१.५ ग्रॅम/लिटर किंवा ०.३ ग्रॅम/लिटर",
//             applicationMethod: "पांढऱ्या माशीसाठी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Eradicate weed hosts (Kanghi Buti) along bunds.",
//         "Sow resistant hybrids early.",
//       ],
//       hi: [
//         "खेत की मेड़ों से कंघी बूटी खरपतवार नष्ट करें।",
//         "प्रतिरोधी किस्मों की समय पर बुआई करें।",
//       ],
//       mr: [
//         "बांधावरील तण नष्ट करा.",
//         "वेळेवर लवकर पेरणी करा आणि प्रतिकारक वाण वापरा.",
//       ],
//     },
//   },

//   grape_black_rot: {
//     crop: { en: "Grape", hi: "अंगूर", mr: "द्राक्ष" },
//     diseaseName: {
//       en: "Grape Black Rot (Guignardia bidwellii)",
//       hi: "अंगूर का काला सड़न रोग (Black Rot)",
//       mr: "द्राक्षावरील काळी सड (Black Rot)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Reddish-brown circular leaf spots with dark margins.",
//         "Berries shrivel into hard black mummies.",
//         "Elongated sunken cankers on shoots.",
//       ],
//       hi: [
//         "पत्तियों पर लाल-भूरे गोल धब्बे।",
//         "अंगूर सूखकर काले कड़े दानों (mummies) में बदल जाते हैं।",
//         "टहनियों पर धंसे हुए घाव।",
//       ],
//       mr: [
//         "पानांवर तपकिरी गोल डाग पडतात.",
//         "मणी वाळून काळे खडे होतात.",
//         "वेलीच्या काड्यांवर काळे खोलगट व्रण तयार होतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Remove all mummified berries hanging on vines or lying on soil."],
//         hi: ["बेल पर लटके और जमीन पर गिरे सूखे सड़े दानों को इकट्ठा कर जलाएं।"],
//         mr: ["वेलीवरील व जमिनीवर पडलेले सुकलेले सडके मणी नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Bordeaux Mixture 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Protective spray",
//           },
//         ],
//         hi: [
//           {
//             name: "बोर्डो मिश्रण 1%",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "सुरक्षात्मक छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "बोर्डो मिश्रण १%",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "प्रतिबंधात्मक फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP or Myclobutanil 10% WP",
//             dosage: "2.5 g/L or 1.0 g/L",
//             applicationMethod: "Spray from early bloom to fruit set",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP या माइक्लोब्यूटानिल",
//             dosage: "2.5 ग्राम/लीटर या 1 ग्राम/लीटर",
//             applicationMethod: "फूल और फल बनते समय छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब किंवा मायक्लोब्युटॅनिल",
//             dosage: "२.५ ग्रॅम किंवा १ ग्रॅम/लिटर",
//             applicationMethod: "फुलोरा ते मणी तयार होताना फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Proper canopy pruning for maximum sunlight and aeration.",
//         "Remove wild vines.",
//       ],
//       hi: [
//         "हवा और धूप के लिए बेलों की उचित छंटाई करें।",
//         "आसपास की जंगली बेलें हटाएं।",
//       ],
//       mr: [
//         "हवा खेळती राहण्यासाठी वेलींची योग्य छाटणी करा.",
//         "परिसरातील जंगली वेली नष्ट करा.",
//       ],
//     },
//   },

//   grape_esca: {
//     crop: { en: "Grape", hi: "अंगूर", mr: "द्राक्ष" },
//     diseaseName: {
//       en: "Esca / Black Measles (Phaeomoniella chlamydospora)",
//       hi: "एस्का / ब्लैक मीसल्स (Phaeomoniella chlamydospora)",
//       mr: "एस्का / ब्लॅक मिझल्स (Phaeomoniella chlamydospora)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Tiger-stripe leaf chlorosis and necrosis.",
//         "Dark freckled spots on berry skins.",
//         "Wood rot inside trunk with dark vascular streaking.",
//       ],
//       hi: [
//         "पत्तियों पर बाघ की धारियों जैसी पीली-भूरी धारियां।",
//         "फलों पर काले छोटे धब्बे।",
//         "तने के अंदर लकड़ी का सड़ना।",
//       ],
//       mr: [
//         "पानांवर वाघाच्या पट्ट्यांसारखे पिवळे-तपकिरी पट्टे दिसतात.",
//         "मण्यांवर काळे बारीक ठिपके येतात.",
//         "खोडाच्या आतील लाकूड सडते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Mark infected vines; cut back dead trunk wood to healthy green tissue.",
//         ],
//         hi: ["तने के सड़े हुए हिस्से को काटकर साफ करें।"],
//         mr: ["वेलीचे सुकलेले खोड निरोगी भागापर्यंत छाटून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Trichoderma atroviride Wound Protectant",
//             dosage: "Thick paste",
//             applicationMethod: "Paint on fresh prune wounds",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइकोडर्मा पेस्ट",
//             dosage: "गाढ़ा लेप",
//             applicationMethod: "कटाई वाले घावों पर लगाएं",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायकोडर्मा पेस्ट",
//             dosage: "घट्ट लेप",
//             applicationMethod: "छाटणीच्या जखमांवर लावा",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Lime Sulfur solution",
//             dosage: "10 ml/L",
//             applicationMethod: "Dormant trunk drench",
//           },
//         ],
//         hi: [
//           {
//             name: "लाइम सल्फर का घोल",
//             dosage: "10 मिली/लीटर",
//             applicationMethod: "सुप्तावस्था में तने पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "लाईम सल्फर द्रावण",
//             dosage: "१० मिली/लिटर",
//             applicationMethod: "विश्रांती काळात खोडावर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Never prune during rain or wet conditions.",
//         "Disinfect shears with 70% alcohol.",
//       ],
//       hi: [
//         "बारिश या नमी के दौरान छंटाई न करें।",
//         "छंटाई वाले औजारों को सैनिटाइज करें।",
//       ],
//       mr: [
//         "पावसात कधीही छाटणी करू नका.",
//         "छाटणीची कात्री सॅनिटायझरने निर्जंतुक करा.",
//       ],
//     },
//   },

//   grape_leaf_blight: {
//     crop: { en: "Grape", hi: "अंगूर", mr: "द्राक्ष" },
//     diseaseName: {
//       en: "Grape Leaf Blight (Pseudocercospora vitis)",
//       hi: "अंगूर पत्ती झुलसा (Pseudocercospora vitis)",
//       mr: "द्राक्षावरील करपा (Pseudocercospora vitis)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Irregular reddish-brown lesions with distinct yellow margins.",
//         "Severe canopy defoliation.",
//         "Impaired cane maturation.",
//       ],
//       hi: [
//         "पत्तियों पर अनियमित लाल-भूरे धब्बे और पीला किनारा।",
//         "पत्तियों का समय से पहले गिरना।",
//         "शाखाओं का कमजोर होना।",
//       ],
//       mr: [
//         "पानांवर पिवळ्या कडांचे अनियमित लालसर-तपकिरी डाग.",
//         "पाने मोठ्या प्रमाणावर गळतात.",
//         "काड्यांची पक्वता थांबते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Sweep up dropped infected foliage from the vine bed."],
//         hi: ["खेत में गिरी पत्तियों को इकट्ठा कर जलाएं।"],
//         mr: ["खाली पडलेली पाने गोळा करून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Oxychloride 50% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर ऑक्सीक्लोराइड 50% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर ऑक्सिक्लोराईड ५०% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Kresoxim-methyl 44.3% SC",
//             dosage: "0.7 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "क्रेसोक्सिम-मिथाइल",
//             dosage: "0.7 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "क्रेसॉक्सिम मिथाईल",
//             dosage: "०.७ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Manage irrigation to avoid high humidity pockets in canopy.",
//         "Shoot thinning.",
//       ],
//       hi: [
//         "अत्यधिक नमी से बचने के लिए उचित सिंचाई करें।",
//         "अनावश्यक शाखाएं हटाएं।",
//       ],
//       mr: [
//         "वेलींमध्ये अतिरिक्त ओलावा साचू देऊ नका.",
//         "अनावश्यक फुटी काढून टाका.",
//       ],
//     },
//   },

//   grape_isariopsis_leaf_spot: {
//     crop: { en: "Grape", hi: "अंगूर", mr: "द्राक्ष" },
//     diseaseName: {
//       en: "Isariopsis Leaf Spot (Phaeoisariopsis vitis)",
//       hi: "इसारियोप्सिस पत्ती धब्बा रोग",
//       mr: "इसारिओप्सिस पानांवरील ठिपके",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Small circular brown spots expanding into irregular necrotic patches.",
//         "Powdery downy fungal underside.",
//         "Premature defoliation exposing bunches to sunburn.",
//       ],
//       hi: [
//         "पत्तियों पर छोटे गोल भूरे धब्बे जो मिलकर बड़े हो जाते हैं।",
//         "पत्ती के नीचे मखमली फफूंद।",
//         "पत्तियां गिरने से फलों पर धूप की कालिमा।",
//       ],
//       mr: [
//         "पानांवर लहान गोल तपकिरी डाग पडून नंतर ते मोठे होतात.",
//         "पानाच्या खाली मखमली बुरशी दिसते.",
//         "पाने गळाल्यामुळे घडांवर उन्हाचा तडाखा बसतो.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune lower canopy leaves touching the soil."],
//         hi: ["जमीन को छूने वाली निचली पत्तियों को काट दें।"],
//         mr: ["जमिनीलगतची पाने छाटून काढा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Cow urine extract (10%) + Neem",
//             dosage: "100 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "गोमूत्र (10%) + नीम अर्क",
//             dosage: "100 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "गोमूत्र अर्क (१०%) + निंबोळी",
//             dosage: "१०० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Difenoconazole 25% EC",
//             dosage: "0.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "डिफेनोकोनाज़ोल 25% EC",
//             dosage: "0.5 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डिफेनोकोनॅझोल २५% EC",
//             dosage: "०.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Maintain trellis height above splash zone.",
//         "Avoid excess nitrogen.",
//       ],
//       hi: ["बेलों को जमीन से उचित ऊंचाई पर रखें।", "अत्यधिक यूरिया न दें।"],
//       mr: ["मांडवाची उंची योग्य राखा.", "नत्राचा अतिवापर टाळा."],
//     },
//   },

//   groundnut_late_leaf_spot: {
//     crop: { en: "Groundnut", hi: "मूंगफली", mr: "भुईमूग" },
//     diseaseName: {
//       en: "Late Leaf Spot / Tikka (Phaeoisariopsis personata)",
//       hi: "टिक्का रोग / पछेती पत्ती धब्बा (Tikka)",
//       mr: "टिक्का रोग (Late Leaf Spot)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Small, circular, nearly black spots on lower leaf surface without a yellow halo.",
//         "Carbonaceous black conidial rings on leaf underside.",
//         "Severe defoliation.",
//       ],
//       hi: [
//         "पत्तियों की निचली सतह पर छोटे, गोल, लगभग काले धब्बे।",
//         "धब्बों के चारों ओर पीला घेरा नहीं होता।",
//         "पत्तियां तेजी से झड़ती हैं।",
//       ],
//       mr: [
//         "पानांच्या खालच्या बाजूला काळे गोलाकार डाग पडतात.",
//         "डागांभोवती पिवळे वलय नसते.",
//         "पाने मोठ्या प्रमाणावर गळतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Stop flood irrigation to lower soil moisture around pods."],
//         hi: ["खेत में पानी का भराव न होने दें।"],
//         mr: ["पाण्याचा अतिवापर टाळा आणि पाण्याचा निचरा करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Pseudomonas fluorescens or Neem oil 3%",
//             dosage: "10 g/L or 30 ml/L",
//             applicationMethod: "Foliar spray at first appearance",
//           },
//         ],
//         hi: [
//           {
//             name: "स्यूडोमोनास फ्लोरोसेंस या नीम का तेल 3%",
//             dosage: "10 ग्राम/लीटर या 30 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "सुडोमोनास किंवा निंबोळी तेल ३%",
//             dosage: "१० ग्रॅम/लिटर किंवा ३० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Tebuconazole 25.9% EC or Mancozeb 75% WP",
//             dosage: "1.0 ml/L or 2.5 g/L",
//             applicationMethod: "Foliar spray at 40 & 60 days after sowing",
//           },
//         ],
//         hi: [
//           {
//             name: "टेबुकोनाज़ोल 25.9% EC या मैंकोजेब",
//             dosage: "1.0 मिली/लीटर या 2.5 ग्राम/लीटर",
//             applicationMethod: "बुवाई के 40 और 60 दिन बाद छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "तेबुकोनॅझोल २५.९% EC किंवा मँकोझेब",
//             dosage: "१.० मिली किंवा २.५ ग्रॅम/लिटर",
//             applicationMethod: "पेरणीनंतर ४० व ६० दिवसांनी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Crop rotation with cereals (sorghum, pearl millet).",
//         "Use resistant cultivars (GPBD-4).",
//       ],
//       hi: [
//         "ज्वार या बाजरा के साथ फसल चक्र अपनाएं।",
//         "प्रतिरोधी किस्मों (जैसे GPBD-4) की बुआई करें।",
//       ],
//       mr: [
//         "ज्वारी किंवा बाजरी सोबत फेरपालट करा.",
//         "प्रतिकारक वाण (उदा. GPBD-4) वापरा.",
//       ],
//     },
//   },

//   groundnut_nutrition_deficiency: {
//     crop: { en: "Groundnut", hi: "मूंगफली", mr: "भुईमूग" },
//     diseaseName: {
//       en: "Iron Chlorosis / Zinc Deficiency",
//       hi: "आयरन / जिंक की कमी (पीलिया रोग)",
//       mr: "लोहाची / जस्ताची कमतरता",
//     },
//     pathogenType: "Deficiency",
//     severityLevel: "Low",
//     symptoms: {
//       en: [
//         "Yellowing of younger leaves with green veins (Iron chlorosis).",
//         "Stunted pod growth and empty pods ('pops').",
//         "Small leaves with upward cupping.",
//       ],
//       hi: [
//         "नई पत्तियों का पीला पड़ना पर नसें हरी रहना (आयरन की कमी)।",
//         "फली में दाने न बनना और खाली रहना।",
//         "पत्तियों का छोटा होना।",
//       ],
//       mr: [
//         "नवीन पाने पिवळी पडतात पण शिरा हिरव्या राहतात.",
//         "शेंगांमध्ये दाणे न भरणे (पोचट शेंगा).",
//         "पाने लहान राहणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Avoid waterlogging which locks up iron in calcareous soils."],
//         hi: ["खेत से अतिरिक्त पानी तुरंत निकालें।"],
//         mr: ["शेतात साचलेले पाणी त्वरित बाहेर काढा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Composted poultry manure application",
//             dosage: "1 ton/acre",
//             applicationMethod: "Soil incorporation",
//           },
//         ],
//         hi: [
//           {
//             name: "अच्छी सड़ी कम्पोस्ट खाद का प्रयोग",
//             dosage: "1 टन/एकड़",
//             applicationMethod: "मिट्टी में मिलाएं",
//           },
//         ],
//         mr: [
//           {
//             name: "चांगले कुजलेले शेणखत किंवा कोंबडी खत",
//             dosage: "१ टन/एकर",
//             applicationMethod: "मातीत मिसळा",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Ferrous Sulfate 0.5% + Citric Acid 0.1%",
//             dosage: "5 g + 1 g per liter",
//             applicationMethod: "Foliar spray twice at 10-day interval",
//           },
//         ],
//         hi: [
//           {
//             name: "फेरस सल्फेट 0.5% + साइट्रिक एसिड 0.1%",
//             dosage: "5 ग्राम + 1 ग्राम प्रति लीटर",
//             applicationMethod: "10 दिन के अंतराल पर 2 बार छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "फेरस सल्फेट ०.५% + सायट्रिक ॲसिड",
//             dosage: "५ ग्रॅम + १ ग्रॅम प्रति लिटर",
//             applicationMethod: "१० दिवसांच्या अंतराने २ वेळा फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Apply Gypsum @ 200 kg/acre at pegging stage (40-45 DAS)."],
//       hi: ["सुइयां बनते समय (40-45 दिन पर) जिप्सम 200 किग्रा/एकड़ डालें।"],
//       mr: ["आऱ्या सुटताना (४०-४५ दिवसांनी) एकरी २०० किलो जिप्सम द्या."],
//     },
//   },

//   orange_citrus_greening: {
//     crop: { en: "Orange", hi: "संतरा", mr: "संत्रा" },
//     diseaseName: {
//       en: "Huanglongbing / Citrus Greening (Candidatus Liberibacter)",
//       hi: "सिट्रस ग्रीनिंग / हुआंगलोंगबिंग (HLB)",
//       mr: "सिट्रस ग्रीनिंग (Huanglongbing)",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Asymmetric blotchy mottle chlorosis on leaves.",
//         "Small, lopsided, bitter green fruit that never color properly.",
//         "Twig dieback and tree decline.",
//       ],
//       hi: [
//         "पत्तियों पर असममित पीले धब्बे।",
//         "फल छोटे, टेढ़े, कड़वे और हरे रहते हैं।",
//         "शाखाओं का सूखना और पेड़ का नष्ट होना।",
//       ],
//       mr: [
//         "पानांवर वेडेवाकडे पिवळे चट्टे पडणे.",
//         "फळे लहान, एका बाजूला वाकडी, कडू आणि हिरवी राहतात.",
//         "फांद्या वाळणे आणि झाड मरण पावणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Uproot severely declined trees to eradicate bacterial reservoir.",
//         ],
//         hi: ["गंभीर रूप से बीमार पेड़ों को उखाड़कर तुरंत नष्ट करें।"],
//         mr: ["जास्त बाधित झाडे मुळासकट उपटून जाळून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem oil 10,000 ppm",
//             dosage: "5 ml/L",
//             applicationMethod: "Asian citrus psyllid vector control",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम का तेल",
//             dosage: "5 मिली/लीटर",
//             applicationMethod: "सिट्रस सिल्ला कीट नियंत्रण के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी तेल",
//             dosage: "५ मिली/लिटर",
//             applicationMethod: "सिल्ला कीड नियंत्रणासाठी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Imidacloprid 17.8% SL or Thiamethoxam 25% WG",
//             dosage: "0.5 ml/L or 0.3 g/L",
//             applicationMethod: "Systemic spray to control psyllids",
//           },
//         ],
//         hi: [
//           {
//             name: "इमिडाक्लोप्रिड 17.8% SL या थियामेथोक्सम",
//             dosage: "0.5 मिली/लीटर या 0.3 ग्राम/लीटर",
//             applicationMethod: "सिल्ला कीट को मारने के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "इमिडाक्लोप्रिड १७.८% SL किंवा थायमेथॉक्झाम",
//             dosage: "०.५ मिली किंवा ०.३ ग्रॅम/लिटर",
//             applicationMethod: "सिल्ला किडीच्या नियंत्रणासाठी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Use certified disease-free budwood.",
//         "Rigorous quarantine enforcement.",
//       ],
//       hi: [
//         "रोगमुक्त प्रमाणित कलमी पौधों का ही उपयोग करें।",
//         "नर्सरी नियमों का कड़ाई से पालन करें।",
//       ],
//       mr: [
//         "फक्त प्रमाणित रोगमुक्त कलमांची लागवड करा.",
//         "रोपवाटिकेच्या नियमांचे काटेकोर पालन करा.",
//       ],
//     },
//   },

//   papaya_bacterial_spot: {
//     crop: { en: "Papaya", hi: "पपीता", mr: "पपई" },
//     diseaseName: {
//       en: "Papaya Bacterial Canker / Spot (Erwinia carotovora)",
//       hi: "पपीता जीवाणु पत्ती धब्बा व सड़न",
//       mr: "पपईवरील जिवाणू डाग व सड",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Water-soaked lesions on leaf lamina and petioles.",
//         "Foul-smelling soft stem collapse.",
//         "Sudden wilting of leaf crown.",
//       ],
//       hi: [
//         "पत्तियों और डंठल पर पानी में भीगे धब्बे।",
//         "तने में बदबूदार गीली सड़न और पौधा गिरना।",
//         "ऊपरी पत्तियों का अचानक मुरझाना।",
//       ],
//       mr: [
//         "पानांवर आणि देठांवर पाण्यासारखे डाग पडतात.",
//         "खोड मऊ पडून दुर्गंधीयुक्त सड होते.",
//         "झाडाचा शेंडा अचानक कोमेजतो.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Excise localized cankered tissue and swab with disinfectant."],
//         hi: ["संक्रमित तने के हिस्से को काटकर साफ करें और दवा लगाएं।"],
//         mr: ["खोड व पानावरील सडलेला भाग कापून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Oxychloride Paste",
//             dosage: "50 g in 100 ml water",
//             applicationMethod: "Stem paint with brush",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर ऑक्सीक्लोराइड लेप",
//             dosage: "गाढ़ा घोल",
//             applicationMethod: "तने के घाव पर ब्रश से लगाएं",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर ऑक्सिक्लोराईड पेस्ट",
//             dosage: "घट्ट लेप",
//             applicationMethod: "खोडाच्या जखमेवर ब्रशने लावा",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Streptocycline 150 ppm + Copper Oxychloride",
//             dosage: "1.5 g Streptocycline + 25 g COC per 10 L",
//             applicationMethod: "Canopy and stem drench",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 1.5 ग्राम + कॉपर ऑक्सीक्लोराइड 25 ग्राम (10L)",
//             dosage: "1.5g+25g/10L",
//             applicationMethod: "तने और पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन १.५ ग्रॅम + कॉपर ऑक्सिक्लोराईड २५ ग्रॅम / १० लिटर",
//             dosage: "१.५g+२५g/१०L",
//             applicationMethod: "झाडावर व खोडावर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid mechanical wounding during weeding.",
//         "Ensure mound drainage.",
//       ],
//       hi: [
//         "निराई-गुड़ाई के समय तने को चोट न लगने दें।",
//         "जड़ों के पास पानी न जमने दें।",
//       ],
//       mr: [
//         "मशागत करताना खोडाला जखम होणार नाही याची काळजी घ्या.",
//         "पाणी साचू देऊ नका.",
//       ],
//     },
//   },

//   papaya_ringspot: {
//     crop: { en: "Papaya", hi: "पपीता", mr: "पपई" },
//     diseaseName: {
//       en: "Papaya Ringspot Virus (PRSV)",
//       hi: "पपीता रिंगस्पॉट वायरस (PRSV)",
//       mr: "पपईवरील रिंगस्पॉट व्हायरस (PRSV)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Prominent dark green rings on fruit skins.",
//         "Shoe-stringing and distortion of leaves.",
//         "Water-soaked streaks on petioles and stunted growth.",
//       ],
//       hi: [
//         "फलों पर छल्लेदार गोल गहरे हरे धब्बे।",
//         "पत्तियों का सिकुड़कर धागे जैसा पतला होना।",
//         "डंठल पर भीगे हुए निशान और विकास रुकना।",
//       ],
//       mr: [
//         "फळांवर गोलाकार कडीसारखे हिरवे डाग पडतात.",
//         "पाने दोऱ्यासारखी बारीक आणि आक्रसलेली होतात.",
//         "झाडाची वाढ पूर्णपणे थांबते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Rogue out infected trees immediately upon spotting symptoms."],
//         hi: ["संक्रमित पौधों को देखते ही उखाड़कर जमीन में दबा दें।"],
//         mr: ["लक्षणे दिसताच रोगट झाडे त्वरित उपटून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Border Barrier Crop (Corn/Sorghum) + Silver Mulch",
//             dosage: "3 border rows",
//             applicationMethod: "Interception of aphid vectors",
//           },
//         ],
//         hi: [
//           {
//             name: "खेत के चारों ओर मक्का/ज्वार की 3 कतारें लगाएं",
//             dosage: "बॉर्डर फसल",
//             applicationMethod: "एफिड कीटों को रोकने के लिए",
//           },
//         ],
//         mr: [
//           {
//             name: "शेताभोवती मका किंवा ज्वारीची ३ ओळींची लागवड",
//             dosage: "संरक्षक ओळी",
//             applicationMethod: "मावा कीड रोखण्यासाठी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Dimethoate 30% EC or Acetamiprid 20% SP",
//             dosage: "1.5 ml/L or 0.5 g/L",
//             applicationMethod: "Spray to suppress aphid vectors",
//           },
//         ],
//         hi: [
//           {
//             name: "डाइमेथोएट 30% EC या एसिटामिप्रिड",
//             dosage: "1.5 मिली/लीटर या 0.5 ग्राम/लीटर",
//             applicationMethod: "माहू (एफिड) नियंत्रण के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डायमेथोएट ३०% EC किंवा ॲसिटामिप्रिड",
//             dosage: "१.५ मिली किंवा ०.५ ग्रॅम/लिटर",
//             applicationMethod: "मावा किडीच्या नियंत्रणासाठी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Plant resistant varieties.",
//         "Raise seedlings under 50-mesh insect-proof net houses.",
//       ],
//       hi: [
//         "रोगरोधी किस्मों की बुआई करें।",
//         "नर्सरी में 50-मेश कीट-रोधी जाली का उपयोग करें।",
//       ],
//       mr: [
//         "प्रतिकारक वाणांची निवड करा.",
//         "रोपवाटिकेमध्ये सुरुवातीपासून ५०-मेश जाळीचा वापर करा.",
//       ],
//     },
//   },

//   peach_bacterial_spot: {
//     crop: { en: "Peach", hi: "आड़ू", mr: "पीच" },
//     diseaseName: {
//       en: "Bacterial Spot (Xanthomonas arboricola pv. pruni)",
//       hi: "आड़ू का जीवाणु धब्बा रोग",
//       mr: "पीचवरील जिवाणू डाग (Shot-hole)",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Angular purple-black leaf lesions dropping out to form shot-holes.",
//         "Pitted, sunken, cracked gumming fruit craters.",
//         "Twig spring cankers.",
//       ],
//       hi: [
//         "पत्तियों पर बैंगनी-काले धब्बे जो सूखकर गिर जाते हैं (छर्रे जैसी छेद)।",
//         "फलों में गड्ढे और गोंद निकलना।",
//         "शाखाओं पर घाव।",
//       ],
//       mr: [
//         "पानांवर डाग पडून ते गळतात व पानांना बंदुकीच्या छऱ्यांसारखी छिद्रे पडतात.",
//         "फळांवर खोलगट खड्डे पडून डिंक वाहतो.",
//         "फांद्यांवर व्रण.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune cankered terminal shoots during dry winter weather."],
//         hi: ["संक्रमित टहनियों को सूखी सर्दियों में काटकर नष्ट करें।"],
//         mr: ["बाधित फांद्या कोरड्या हवामानात छाटून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Spray at dormant bud swell and 50% petal fall",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2 ग्राम/लीटर",
//             applicationMethod: "कली फूटते समय और फूल झड़ने पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२ ग्रॅम/लिटर",
//             applicationMethod: "कळ्या फुटताना व पाकळ्या गळताना फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Oxytetracycline or Streptocycline",
//             dosage: "100 ppm",
//             applicationMethod:
//               "Apply during cover sprays following hail injury",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 100 ppm",
//             dosage: "1 ग्राम प्रति 10 लीटर",
//             applicationMethod: "ओलावृष्टि या चोट के बाद छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन",
//             dosage: "१ ग्रॅम / १० लिटर",
//             applicationMethod: "गारपीट किंवा इजा झाल्यानंतर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid planting in sandy wind-blown sites without windbreaks.",
//         "Plant resistant cultivars.",
//       ],
//       hi: [
//         "हवा के कटाव से बचाव के लिए बाड़ लगाएं।",
//         "रोग प्रतिरोधी किस्मों की रोपाई करें।",
//       ],
//       mr: ["वारा प्रतिबंधक झाडे लावा.", "रोगप्रतिकारक जातींची लागवड करा."],
//     },
//   },

//   pepper_bell_bacterial_spot: {
//     crop: { en: "Bell Pepper", hi: "शिमला मिर्च", mr: "ढोबळी मिरची" },
//     diseaseName: {
//       en: "Bacterial Spot (Xanthomonas euvesicatoria)",
//       hi: "शिमला मिर्च का जीवाणु धब्बा रोग",
//       mr: "ढोबळी मिरचीवरील जिवाणू ठिपके",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Small water-soaked circular lesions turning dark brown with pale centers.",
//         "Severe premature defoliation causing fruit sunscald.",
//         "Rough blister-like scabs on fruit.",
//       ],
//       hi: [
//         "पत्तियों पर पानी से भीगे छोटे भूरे-काले धब्बे।",
//         "पत्तियों का गिरना जिससे फल धूप से झुलस जाते हैं।",
//         "फलों पर पपड़ीदार फफोले।",
//       ],
//       mr: [
//         "पानांवर लहान तेलकट काळे ठिपके पडतात.",
//         "पाने गळाल्यामुळे फळांवर उन्हाचे चटके बसतात.",
//         "फळांवर खरबरीत खपलीसारखे डाग येतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Discard infected nursery seedlings immediately; do not transplant.",
//         ],
//         hi: ["नर्सरी में संक्रमित पौधों को तुरंत नष्ट करें, रोपाई न करें।"],
//         mr: [
//           "रोपवाटिकेत रोगट रोपे दिसल्यास ती फेकून द्या, पुनर्लागवड करू नका.",
//         ],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Protective foliar canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर सुरक्षात्मक छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२ ग्रॅम/लिटर",
//             applicationMethod: "प्रतिबंधात्मक फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Streptocycline 100 ppm + Copper Oxychloride 50% WP",
//             dosage: "1 g Streptocycline + 25 g COC per 10 L",
//             applicationMethod: "Foliar spray at 7-day intervals in wet weather",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 1 ग्राम + कॉपर ऑक्सीक्लोराइड 25 ग्राम (10L)",
//             dosage: "1g+25g/10L",
//             applicationMethod: "7 दिन के अंतराल पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन १ ग्रॅम + कॉपर ऑक्सिक्लोराईड २५ ग्रॅम / १० लिटर",
//             dosage: "१g+२५g/१०L",
//             applicationMethod: "पावसाळी हवेत दर ७ दिवसांनी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Hot water seed treatment at 50°C for 25 min.",
//         "Never cultivate when foliage is wet.",
//       ],
//       hi: [
//         "बीजों को 50°C गर्म पानी में 25 मिनट उपचारित करें।",
//         "गीले पौधों के दौरान काम न करें।",
//       ],
//       mr: [
//         "पेरणीपूर्वी ५०°C गरम पाण्यात २५ मिनिटे बीजप्रक्रिया करा.",
//         "पाने ओली असताना आंतरमशागत करू नका.",
//       ],
//     },
//   },

//   potato_early_blight: {
//     crop: { en: "Potato", hi: "आलू", mr: "बटाटा" },
//     diseaseName: {
//       en: "Early Blight (Alternaria solani)",
//       hi: "अगेती झुलसा / अर्ली ब्लाइट",
//       mr: "लवकर येणारा करपा / अर्ली ब्लाइट",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Dark brown to black target-board lesions with concentric rings on older leaves.",
//         "Yellow chlorosis surrounding lesions.",
//         "Dark sunken dry rot on tubers.",
//       ],
//       hi: [
//         "पुरानी पत्तियों पर संकेंद्रित छल्लों वाले गहरे भूरे-काले धब्बे।",
//         "धब्बों के चारों ओर पीलापन।",
//         "आलू के कंदों पर धंसे हुए सूखे सड़न के निशान।",
//       ],
//       mr: [
//         "खालच्या पानांवर गोल वलयाकार (टार्गेट बोर्डसारखे) डाग दिसतात.",
//         "डागांच्या आजूबाजूला पिवळेपणा.",
//         "बटाट्यावर खोलगट कोरडी सड होते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune heavily spotted lower leaves and remove from field."],
//         hi: ["ज्यादा प्रभावित निचली पत्तियों को तोड़कर नष्ट करें।"],
//         mr: ["बाधित झालेली खालची पाने तोडून शेताबाहेर नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Trichoderma viride 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Foliar canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइकोडर्मा विरिडी 1%",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायकोडर्मा व्हिरिडी १%",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Chlorothalonil 75% WP or Mancozeb 75% WP",
//             dosage: "2.5 g/L",
//             applicationMethod:
//               "Foliar spray every 10 days starting at tuber initiation",
//           },
//         ],
//         hi: [
//           {
//             name: "क्लोरोथालोनिल 75% WP या मैंकोजेब 75% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "कंद बनने की शुरुआत से हर 10 दिन में छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "क्लोरोथालोनील ७५% WP किंवा मँकोझेब",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod:
//               "बटाटे पोसण्याच्या अवस्थेत दर १० दिवसांनी फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "3-year crop rotation avoiding Solanaceous family.",
//         "Maintain optimal nitrogen and avoid drought stress.",
//       ],
//       hi: [
//         "टमाटर-बैंगन से अलग 3 साल का फसल चक्र अपनाएं।",
//         "संतुलित नाइट्रोजन दें और सूखे से बचाएं।",
//       ],
//       mr: [
//         "टोमॅटोवर्गीय पिके वगळून ३ वर्षांची फेरपालट करा.",
//         "समतोल खत व्यवस्थापन करा.",
//       ],
//     },
//   },

//   potato_late_blight: {
//     crop: { en: "Potato", hi: "आलू", mr: "बटाटा" },
//     diseaseName: {
//       en: "Late Blight (Phytophthora infestans)",
//       hi: "पछेती झुलसा / लेट ब्लाइट",
//       mr: "उशिरा येणारा करपा / लेट ब्लाइट",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Water-soaked dark lesions with white cottony mildew underneath in humid mornings.",
//         "Rapid whole-canopy collapse with foul odor.",
//         "Brown dry rot in tuber flesh.",
//       ],
//       hi: [
//         "पत्तियों पर पानी से भीगे काले धब्बे और नीचे सफेद रुई जैसी फफूंद।",
//         "पौधे का तेजी से गलकर नष्ट होना।",
//         "आलू के कंदों के अंदर भूरी सड़न।",
//       ],
//       mr: [
//         "पानांवर काळे पाणथळ डाग व पाठीमागे पांढरी बुरशी वाढते.",
//         "संपूर्ण पीक करपून दुर्गंधी पसरते.",
//         "बटाट्याच्या आत तपकिरी रंगाची कोरडी सड होते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Kill/cut potato haulms 10 days prior to digging if foliage is blighted.",
//         ],
//         hi: ["रोग फैलने पर आलू खुदाई से 10 दिन पहले बेलें काटकर हटा दें।"],
//         mr: [
//           "रोग जास्त असल्यास बटाटा काढणीपूर्वी १० दिवस आधी झाडांचे शेंडे छाटा.",
//         ],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.5 g/L",
//             applicationMethod: "Preventive barrier spray before rains",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "बारिश से पहले बचाव के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "पावसापूर्वी प्रतिबंधात्मक फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Metalaxyl 8% + Mancozeb 64% WP or Cymoxanil",
//             dosage: "2.5 g/L",
//             applicationMethod:
//               "Curative systemic spray immediately upon detection",
//           },
//         ],
//         hi: [
//           {
//             name: "मेटालेक्सिल 8% + मैंकोजेब 64% WP (रिडोमिल)",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "लक्षण दिखते ही प्रणालीगत कवकनाशी छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मेटॅलॅक्सिल + मँकोझेब (उदा. रिडोमिल)",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "लक्षणे दिसताच अंतरप्रवाही फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Hill up soil over developing tubers.",
//         "Eliminate cull piles and volunteer potatoes.",
//       ],
//       hi: [
//         "कंदों पर अच्छी तरह मिट्टी चढ़ाएं।",
//         "पुराने आलू के ढेरों को नष्ट करें।",
//       ],
//       mr: [
//         "बटाट्यांवर मातीची चांगली भर लावा.",
//         "खराब बटाट्यांचे ढीग नष्ट करा.",
//       ],
//     },
//   },

//   rice_brown_spot: {
//     crop: { en: "Rice", hi: "धान", mr: "भात" },
//     diseaseName: {
//       en: "Rice Brown Spot (Bipolaris oryzae)",
//       hi: "धान का भूरा धब्बा रोग (Brown Spot)",
//       mr: "भातावरील तपकिरी ठिपके (Brown Spot)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Oval, sesame seed-shaped brown spots with yellow halos.",
//         "Spots coalesce causing seedling and leaf blight.",
//         "Black discoloration on grain hulls.",
//       ],
//       hi: [
//         "पत्तियों पर तिल के बीज जैसे अंडाकार भूरे धब्बे और पीला घेरा।",
//         "धब्बे मिलकर पत्तियों को झुलसा देते हैं।",
//         "धान के दानों के छिलके काले पड़ना।",
//       ],
//       mr: [
//         "पानांवर तिळासारखे लंबगोलाकार तपकिरी डाग दिसतात.",
//         "ठिपके एकत्र येऊन पाने करपतात.",
//         "दाण्यांवर काळे डाग पडून प्रत खालावते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Top dress with potassium and zinc to relieve soil nutrient stress.",
//         ],
//         hi: ["पोटाश और जिंक की कमी को तुरंत पूरा करें।"],
//         mr: ["जमिनीत पालाश (Potash) व जस्त (Zinc) खते द्या."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem cake soil application + Pseudomonas fluorescens",
//             dosage: "100 kg/acre + 10 g/L spray",
//             applicationMethod: "Soil + Foliar",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम खली + स्यूडोमोनास 1%",
//             dosage: "100 किग्रा/एकड़ + 10 ग्राम/लीटर",
//             applicationMethod: "मिट्टी और पत्तियों पर",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी पेंड + सुडोमोनास",
//             dosage: "१०० किलो/एकर + १० ग्रॅम/लिटर",
//             applicationMethod: "मातीत व पानांवर",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Propiconazole 25% EC or Mancozeb 75% WP",
//             dosage: "1.0 ml/L or 2.5 g/L",
//             applicationMethod: "Foliar spray at boot leaf stage",
//           },
//         ],
//         hi: [
//           {
//             name: "प्रोपिकोनाज़ोल 25% EC या मैंकोजेब",
//             dosage: "1.0 मिली/लीटर या 2.5 ग्राम/लीटर",
//             applicationMethod: "बाली निकलने से पहले छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "प्रोपिकोनाझोल किंवा मँकोझेब",
//             dosage: "१.० मिली किंवा २.५ ग्रॅम/लिटर",
//             applicationMethod: "पोटरीच्या अवस्थेत फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Treat seed with Carbendazim (2g/kg).",
//         "Correct soil silicon and zinc deficiency.",
//       ],
//       hi: [
//         "बुआई से पहले कार्बेन्डाजिम से बीजोपचार करें।",
//         "जिंक की कमी दूर करें।",
//       ],
//       mr: [
//         "पेरणीपूर्वी बुरशीनाशकाची बीजप्रक्रिया करा.",
//         "जमिनीतील झिंकची कमतरता भरून काढा.",
//       ],
//     },
//   },

//   rice_leaf_blast: {
//     crop: { en: "Rice", hi: "धान", mr: "भात" },
//     diseaseName: {
//       en: "Rice Leaf Blast (Magnaporthe oryzae)",
//       hi: "धान का ब्लास्ट रोग / झुलसा",
//       mr: "भातावरील करपा (Rice Blast)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Spindle-shaped elliptical lesions with gray/white centers and dark brown margins.",
//         "Neck rot causing whitish upright empty panicles (whiteheads).",
//       ],
//       hi: [
//         "पत्तियों पर आंख या नाव के आकार के धब्बे जिनका केंद्र सफेद और किनारे भूरे होते हैं।",
//         "बालियों का सूखना जिससे दाने नहीं बनते (सफेद बालियां)।",
//       ],
//       mr: [
//         "पानांवर डोळ्याच्या किंवा नावेच्या आकाराचे करपलेले ठिपके.",
//         "मानेवर करपा आल्यामुळे लोंब्या पांढऱ्या पडून पोचट होतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Immediately withhold further nitrogen/urea top dressing."],
//         hi: ["यूरिया (नाइट्रोजन) डालना तुरंत रोक दें।"],
//         mr: ["युरियाचा वापर त्वरित थांबवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Pseudomonas fluorescens 1%",
//             dosage: "10 g/L",
//             applicationMethod: "Foliar canopy wash",
//           },
//         ],
//         hi: [
//           {
//             name: "स्यूडोमोनास फ्लोरोसेंस",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "सुडोमोनास फ्लोरोसन्स",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Tricyclazole 75% WP",
//             dosage: "0.6 g/L (120 g/acre)",
//             applicationMethod:
//               "Foliar spray at tillering and panicle emergence",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइसाइक्लाजोल 75% WP",
//             dosage: "0.6 ग्राम/लीटर (120g/एकड़)",
//             applicationMethod: "कल्ले फूटते समय और बाली निकलते समय छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायसायक्लॅझोल ७५% WP",
//             dosage: "०.६ ग्रॅम/लिटर",
//             applicationMethod: "फुटवे व पोटरीच्या अवस्थेत फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid excess nitrogen; split fertilizer application.",
//         "Grow blast-tolerant varieties.",
//       ],
//       hi: [
//         "नाइट्रोजन का संतुलित प्रयोग करें।",
//         "रोगरोधी किस्मों की खेती करें।",
//       ],
//       mr: ["नत्राचा अतिवापर टाळा.", "रोगप्रतिकारक भाताच्या वाणांची निवड करा."],
//     },
//   },

//   soybean_caterpillar: {
//     crop: { en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },
//     diseaseName: {
//       en: "Defoliating Caterpillar (Spodoptera litura)",
//       hi: "सोयाबीन की इल्ली / तंबाकू कैटरपिलर",
//       mr: "सोयाबीनवरील लष्करी अळी (Caterpillar)",
//     },
//     pathogenType: "Pest",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Skeletonized leaves with only veins remaining.",
//         "Extensive defoliation during flowering.",
//         "Caterpillars chewing floral buds and pods.",
//       ],
//       hi: [
//         "पत्तियों को छलनी कर देना, केवल नसें छोड़ना।",
//         "फूल और फलियों को खाना।",
//         "खेत में पौधों का पत्ती-विहीन होना।",
//       ],
//       mr: [
//         "पाने कुरतडून जाळीदार करणे व फक्त शिरा शिल्लक ठेवणे.",
//         "फुले व कोवळ्या शेंगा खाणे.",
//         "मोठ्या प्रमाणावर झाडे निष्पर्ण होणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Deploy pheromone traps to monitor adult moth activity."],
//         hi: ["फेरोमोन ट्रैप लगाकर पतंगों पर नजर रखें।"],
//         mr: ["कामगंध सापळे लावून पतंगांवर लक्ष ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Beauveria bassiana or SlNPV virus",
//             dosage: "5.0 g/L or 1.5 ml/L",
//             applicationMethod: "Evening canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "ब्युवेरिया बासियाना जैव-कीटनाशक",
//             dosage: "5 ग्राम/लीटर",
//             applicationMethod: "शाम के समय छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "बिव्हेरिया बॅसियाना जैविक बुरशी",
//             dosage: "५ ग्रॅम/लिटर",
//             applicationMethod: "संध्याकाळी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Chlorantraniliprole 18.5% SC (Coragen)",
//             dosage: "0.3 ml/L (60 ml/acre)",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कोराजन (Chlorantraniliprole 18.5% SC)",
//             dosage: "0.3 मिली/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "क्लोराँट्रानिलीप्रोल (कोराजन)",
//             dosage: "०.३ मिली/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Plant castor/sunflower as trap crops.",
//         "Collect and destroy egg masses.",
//       ],
//       hi: [
//         "खेत के किनारे अरंडी की ट्रैप फसल लगाएं।",
//         "अंडों के समूहों को नष्ट करें।",
//       ],
//       mr: ["बांधावर एरंडीची सापळा पिके लावा.", "अंडीपुंज गोळा करून नष्ट करा."],
//     },
//   },

//   soybean_diabrotica_speciosa: {
//     crop: { en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },
//     diseaseName: {
//       en: "Leaf Beetle (Diabrotica speciosa)",
//       hi: "लीफ बीटल / पत्ती भृंग",
//       mr: "पाने खाणारा भुंगा (Leaf Beetle)",
//     },
//     pathogenType: "Pest",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Small circular holes shot through leaf blades.",
//         "Root pruning from larval feeding.",
//         "Reduced pod fill.",
//       ],
//       hi: [
//         "पत्तियों में गोल छेद होना।",
//         "लार्वा द्वारा जड़ों को नुकसान पहुंचाना।",
//         "दाने छोटे रहना।",
//       ],
//       mr: [
//         "पानांना गोल छिद्रे पडणे.",
//         "अळ्यांद्वारे मुळे कुरतडणे.",
//         "शेंगा भरण्याचे प्रमाण घटणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Cultivate inter-rows to expose pupae to sun."],
//         hi: ["मिट्टी की गुड़ाई करें ताकि कीट की प्यूपा धूप से नष्ट हो।"],
//         mr: ["आंतरमशागत करून कोष उघडे करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem Seed Kernel Extract 5%",
//             dosage: "50 ml/L",
//             applicationMethod: "Foliar deterrent",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम बीज अर्क 5%",
//             dosage: "50 मिली/लीटर",
//             applicationMethod: "पत्तियों पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी अर्क ५%",
//             dosage: "५० मिली/लिटर",
//             applicationMethod: "पानांवर फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC",
//             dosage: "0.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "थियामेथोक्सम + लैम्ब्डा साइहलोथ्रिन",
//             dosage: "0.5 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "थायमेथॉक्झाम + लॅम्बडा सायहॅलोथ्रीन",
//             dosage: "०.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Seed treatment with Thiamethoxam 30% FS.",
//         "Rotate out of cucurbits.",
//       ],
//       hi: [
//         "बुआई से पहले कीटनाशक से बीजोपचार करें।",
//         "कद्दू वर्गीय फसलों के बाद न लगाएं।",
//       ],
//       mr: [
//         "पेरणीपूर्वी थायमेथॉक्झामने बीजप्रक्रिया करा.",
//         "वेलवर्गीय पिकांनंतर फेरपालट करा.",
//       ],
//     },
//   },

//   squash_powdery_mildew: {
//     crop: { en: "Squash", hi: "कद्दू वर्गीय", mr: "भोपळा" },
//     diseaseName: {
//       en: "Squash Powdery Mildew (Podosphaera xanthii)",
//       hi: "कद्दू का पाउडरी मिल्ड्यू (चूर्णिल आसिता)",
//       mr: "भोपळ्यावरील भुरी रोग",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "White talcum-powder patches covering leaves.",
//         "Leaves brown and dry prematurely.",
//         "Fruit sunscald.",
//       ],
//       hi: [
//         "पत्तियों और डंठल पर सफेद पाउडर जैसी फफूंद।",
//         "पत्तियां सूखकर भूरी होना।",
//         "फलों का धूप से झुलसना।",
//       ],
//       mr: [
//         "पानांवर पांढऱ्या पावडरीसारखे थर साचतात.",
//         "पाने वाळून चुरडतात.",
//         "फळांवर उन्हाचे चटके बसतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune old, heavily shaded infected leaves."],
//         hi: ["पुरानी संक्रमित पत्तियों को काटकर नष्ट करें।"],
//         mr: ["खालची जुनी बाधित पाने तोडून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Baking Soda + Horticultural Oil",
//             dosage: "5 g + 5 ml per liter",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "बेकिंग सोडा + बागवानी तेल",
//             dosage: "5 ग्राम + 5 मिली प्रति लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "बेकिंग सोडा + तेल",
//             dosage: "५ ग्रॅम + ५ मिली प्रति लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Hexaconazole 5% EC or Dinocap 48% EC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "हेक्साकोनाज़ोल 5% EC",
//             dosage: "1.0 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "हेक्झाकोनॅझोल ५% EC",
//             dosage: "१.० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Plant resistant squash hybrids.", "Space widely for ventilation."],
//       hi: ["रोगरोधी किस्मों की बुआई करें।", "पौधों के बीच पर्याप्त दूरी रखें।"],
//       mr: ["प्रतिकारक वाण वापरा.", "हवा खेळती राहण्यासाठी योग्य अंतर ठेवा."],
//     },
//   },

//   strawberry_leaf_scorch: {
//     crop: { en: "Strawberry", hi: "स्ट्रॉबेरी", mr: "स्ट्रॉबेरी" },
//     diseaseName: {
//       en: "Strawberry Leaf Scorch (Diplocarpon earlianum)",
//       hi: "स्ट्रॉबेरी लीफ स्कॉर्च / पत्ती झुलसा",
//       mr: "स्ट्रॉबेरीवरील करपा (Leaf Scorch)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Irregular purple-to-dark brown blotches without clear white centers.",
//         "Leaf margins look burned and curled upward.",
//         "Fruit cap browning.",
//       ],
//       hi: [
//         "पत्तियों पर बैंगनी-भूरे धब्बे।",
//         "पत्ती के किनारे जले हुए और ऊपर मुड़े दिखना।",
//         "फलों की टोपी (कैप) का भूरा पड़ना।",
//       ],
//       mr: [
//         "पानांवर जांभळट-तपकिरी डाग पडतात.",
//         "पानांच्या कडा करपल्यासारख्या होऊन वर वळतात.",
//         "फळांचा देठ काळा पडणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Mow down and burn foliage after final harvest."],
//         hi: ["तुड़ाई के बाद पुरानी पत्तियों को काटकर जला दें।"],
//         mr: ["हंगाम संपल्यावर जुनी पाने छाटून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Early season spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2 ग्राम/लीटर",
//             applicationMethod: "शुरुआती छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२ ग्रॅम/लिटर",
//             applicationMethod: "सुरुवातीला फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Captan 50% WP or Dodine 65% WP",
//             dosage: "2.0 g/L or 1.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कैप्टान 50% WP या डोडिन",
//             dosage: "2.0 ग्राम/लीटर या 1.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॅप्टन ५०% WP किंवा डोडिन",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Use drip irrigation; avoid overhead sprinkling.",
//         "Use straw mulch.",
//       ],
//       hi: ["ड्रिप सिंचाई का उपयोग करें।", "स्ट्रॉ (पुआल) की मल्चिंग करें।"],
//       mr: ["ठिबक सिंचन वापरा.", "प्लॅस्टिक किंवा भुशाचे आच्छादन करा."],
//     },
//   },

//   sugarcane_brown_spot: {
//     crop: { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
//     diseaseName: {
//       en: "Sugarcane Brown Spot (Bipolaris sacchari)",
//       hi: "गन्ने का भूरा धब्बा रोग",
//       mr: "उसावरील तपकिरी डाग",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Reddish-brown linear spots parallel to leaf veins.",
//         "Straw-colored centers with dark reddish borders.",
//         "Premature withering of leaves.",
//       ],
//       hi: [
//         "पत्तियों की नसों के समानांतर लाल-भूरे लंबे धब्बे।",
//         "धब्बों के बीच का भाग भूसा जैसा और किनारे लाल।",
//         "पत्तियों का समय से पहले सूखना।",
//       ],
//       mr: [
//         "पानांच्या शिरांना समांतर लालसर-तपकिरी डाग पडतात.",
//         "डागांचा मधला भाग पांढरट-तपकिरी होतो.",
//         "पाने अकाली वाळतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Strip off and compost dried diseased lower leaves."],
//         hi: ["निचली सूखी संक्रमित पत्तियों को उतारकर नष्ट करें।"],
//         mr: ["खालची सुकलेली रोगट पाने काढून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Panchagavya foliar wash (3%)",
//             dosage: "30 ml/L",
//             applicationMethod: "Canopy spray",
//           },
//         ],
//         hi: [
//           {
//             name: "पंचगव्य का छिड़काव (3%)",
//             dosage: "30 मिली/लीटर",
//             applicationMethod: "पत्तियों पर",
//           },
//         ],
//         mr: [
//           {
//             name: "पंचगव्य ३%",
//             dosage: "३० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Carbendazim 50% WP or Mancozeb",
//             dosage: "1.0 g/L or 2.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कार्बेन्डाजिम 50% WP या मैंकोजेब",
//             dosage: "1.0 ग्राम/लीटर या 2.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कार्बेन्डाझिम ५०% WP किंवा मँकोझेब",
//             dosage: "१.० ग्रॅम किंवा २.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Ensure adequate potassium fertilizing.",
//         "Avoid excessive ratoon cropping.",
//       ],
//       hi: [
//         "पोटाश खाद की संतुलित मात्रा दें।",
//         "अधिक बार पेड़ी (ratoon) न लें।",
//       ],
//       mr: ["पालाश खताचा योग्य वापर करा.", "रोगट उसाचा खोडवा घेणे टाळा."],
//     },
//   },

//   sugarcane_grassy_shoot: {
//     crop: { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
//     diseaseName: {
//       en: "Grassy Shoot Disease (Phytoplasma)",
//       hi: "गन्ने का ग्रासी शूट रोग (घास जैसी वृद्धि)",
//       mr: "उसावरील गवताळ वाढ (Grassy Shoot)",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Proliferation of dense, thin, grassy, chlorotic tillers at base.",
//         "No millable cane produced.",
//         "Shortened internodes and bushy clump.",
//       ],
//       hi: [
//         "गन्ने के आधार से बारीक, पीली, घास जैसी ढेर सारी पत्तियां निकलना।",
//         "गन्ना न बनना और पोरियां बहुत छोटी रहना।",
//       ],
//       mr: [
//         "उसाच्या बुंध्यातून गवतासारखे बारीक पिवळे असंख्य फुटवे येतात.",
//         "कांड्या बनत नाहीत आणि कारखाना योग्य ऊस तयार होत नाही.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Rogue out and destroy infected stools immediately."],
//         hi: ["संक्रमित पौधों को तुरंत उखाड़कर जला दें।"],
//         mr: ["रोगट बेटे त्वरित उपटून जाळून नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem oil 10,000 ppm",
//             dosage: "3 ml/L",
//             applicationMethod: "Target aphid vectors",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम का तेल",
//             dosage: "3 मिली/लीटर",
//             applicationMethod: "एफिड कीट नियंत्रण के लिए",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी अर्क",
//             dosage: "३ मिली/लिटर",
//             applicationMethod: "मावा किडीच्या नियंत्रणासाठी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Dimethoate 30% EC",
//             dosage: "1.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "डाइमेथोएट 30% EC",
//             dosage: "1.5 मिली/लीटर",
//             applicationMethod: "एफिड्स को मारने के लिए छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डायमेथोएट ३०% EC",
//             dosage: "१.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Hot Water/Steam Treatment (AST) of setts at 50°C for 1 hr.",
//         "Never take ratoon from infected fields.",
//       ],
//       hi: [
//         "गन्ने के टुकड़ों को 50°C पर 1 घंटे गर्म जल से उपचारित करें।",
//         "बीमार खेत में पेड़ी न लें।",
//       ],
//       mr: [
//         "लागवडीपूर्वी बेण्यांवर ५०°C गरम पाण्याची प्रक्रिया करा.",
//         "रोगट शेतात खोडवा घेऊ नका.",
//       ],
//     },
//   },

//   tomato_bacterial_spot: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Bacterial Spot (Xanthomonas perforans)",
//       hi: "टमाटर का जीवाणु धब्बा रोग",
//       mr: "टोमॅटोवरील जिवाणू डाग",
//     },
//     pathogenType: "Bacterial",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Small water-soaked dark spots with yellow halos.",
//         "Scab-like raised fruit lesions.",
//         "Severe defoliation.",
//       ],
//       hi: [
//         "पत्तियों पर पीले घेरे वाले छोटे काले धब्बे।",
//         "फलों पर पपड़ीदार उभरे निशान।",
//         "पत्तियों का तेजी से गिरना।",
//       ],
//       mr: [
//         "पानांवर पिवळ्या वलयाचे काळे ठिपके.",
//         "फळांवर खपली पडणे.",
//         "पानांची गळती होऊन फळांवर उन्हाचा तडाखा बसणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Strip and destroy infected lower leaves."],
//         hi: ["संक्रमित निचली पत्तियों को तोड़कर नष्ट करें।"],
//         mr: ["रोगट पाने काढून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Streptocycline 100 ppm + Copper Oxychloride 50% WP",
//             dosage: "1 g Streptocycline + 30 g COC per 10 L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "स्ट्रेप्टोसाइक्लिन 1 ग्राम + कॉपर ऑक्सीक्लोराइड 30 ग्राम (10L)",
//             dosage: "1g+30g/10L",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्ट्रेप्टोसायक्लिन १ ग्रॅम + कॉपर ऑक्सिक्लोराईड ३० ग्रॅम / १० लिटर",
//             dosage: "१g+३०g/१०L",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid overhead irrigation.",
//         "Rotate crops with non-solanaceous species.",
//       ],
//       hi: ["फव्वारा सिंचाई से बचें।", "टमाटर के बाद दलहनी फसलें लगाएं।"],
//       mr: ["तुषार सिंचन टाळा.", "टोमॅटोवर्गीय पिके वगळून फेरपालट करा."],
//     },
//   },

//   tomato_early_blight: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Early Blight (Alternaria solani)",
//       hi: "टमाटर का अगेती झुलसा",
//       mr: "टोमॅटोवरील लवकर येणारा करपा",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Concentric ring target lesions on older leaves.",
//         "Yellow chlorosis around spots.",
//         "Collar rot at stem base.",
//       ],
//       hi: [
//         "पुरानी पत्तियों पर संकेंद्रित छल्लेदार काले-भूरे धब्बे।",
//         "धब्बों के चारों ओर पीला घेरा।",
//         "तने के आधार पर सड़न।",
//       ],
//       mr: [
//         "पानांवर गोलाकार चकत्यांसारखे (Target Board) डाग पडतात.",
//         "डागांभोवती पिवळेपणा.",
//         "खोडाच्या बुंध्याशी काळी सड.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune off infected lower leaves immediately."],
//         hi: ["संक्रमित निचली पत्तियों को तुरंत काटकर हटाएं।"],
//         mr: ["खालची रोगट पाने त्वरित काढून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Trichoderma viride + Neem Oil",
//             dosage: "10 g/L + 5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "ट्राइकोडर्मा + नीम का तेल",
//             dosage: "10 ग्राम + 5 मिली प्रति लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "ट्रायकोडर्मा + निंबोळी तेल",
//             dosage: "१० ग्रॅम + ५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP or Azoxystrobin + Difenoconazole",
//             dosage: "2.5 g/L or 1.0 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP या एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल",
//             dosage: "2.5 ग्राम/लीटर या 1 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब ७५% WP किंवा अझॉक्सीस्ट्रॉबिन + डिफेनोकोनॅझोल",
//             dosage: "२.५ ग्रॅम किंवा १ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Mulch heavily with straw to stop soil rain splash.",
//         "3-year crop rotation.",
//       ],
//       hi: [
//         "मिट्टी के छींटों से बचाव के लिए पुआल की मल्चिंग करें।",
//         "3 साल का फसल चक्र अपनाएं।",
//       ],
//       mr: ["आच्छादन (Mulching) चा वापर करा.", "३ वर्षांची फेरपालट करा."],
//     },
//   },

//   tomato_late_blight: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Late Blight (Phytophthora infestans)",
//       hi: "टमाटर का पछेती झुलसा",
//       mr: "टोमॅटोवरील उशिरा येणारा करपा",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Greasy water-soaked lesions turning dark brown with white downy underside in humidity.",
//         "Rapid whole canopy collapse.",
//         "Firm brown rot on fruits.",
//       ],
//       hi: [
//         "पत्तियों पर पानी से भीगे भूरे धब्बे और नीचे सफेद फफूंद।",
//         "पौधे का तेजी से गलना।",
//         "फलों पर भूरी सड़न।",
//       ],
//       mr: [
//         "पाने काळी पडून जळाल्यासारखी होतात व पाठीमागे पांढरी बुरशी वाढते.",
//         "फळांवर तपकिरी डाग.",
//         "पीक झपाट्याने नष्ट होते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Remove and destroy all infected plants outside field."],
//         hi: ["संक्रमित पौधों को उखाड़कर खेत से बाहर नष्ट करें।"],
//         mr: ["बाधित झाडे उपटून शेताबाहेर नष्ट करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Cymoxanil 8% + Mancozeb 64% WP or Metalaxyl",
//             dosage: "2.5 g/L",
//             applicationMethod: "Curative systemic spray",
//           },
//         ],
//         hi: [
//           {
//             name: "साइमोक्सानिल + मैंकोजेब या मेटालेक्सिल",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "प्रणालीगत कवकनाशी छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "सायमॉक्झॅनिल + मँकोझेब किंवा मेटॅलॅक्सिल",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Ensure wide spacing for ventilation.",
//         "Avoid overhead irrigation.",
//       ],
//       hi: ["पौधों के बीच पर्याप्त दूरी रखें।", "ड्रिप सिंचाई का उपयोग करें।"],
//       mr: ["हवा खेळती राहील असे अंतर ठेवा.", "तुषार सिंचन टाळा."],
//     },
//   },

//   tomato_leaf_mold: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Leaf Mold (Passalora fulva)",
//       hi: "टमाटर का लीफ मोल्ड (पत्ती फफूंद)",
//       mr: "टोमॅटोवरील लीफ मोल्ड (पानांवरील बुरशी)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Pale yellow spots on upper leaf surfaces.",
//         "Olive-green to brown velvety mold on undersides.",
//         "Leaves roll and drop.",
//       ],
//       hi: [
//         "पत्ती की ऊपरी सतह पर पीले धब्बे।",
//         "पत्ती के नीचे जैतून-हरे मखमली फफूंद।",
//         "पत्तियों का मुड़ना और गिरना।",
//       ],
//       mr: [
//         "पानांच्या वर पिवळे डाग पडतात.",
//         "पानांच्या खाली मखमली हिरवट-तपकिरी बुरशी वाढते.",
//         "पाने वळतात आणि गळतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune lower foliage and ventilate greenhouses/tunnels."],
//         hi: ["निचली पत्तियों की छंटाई करें और ग्रीनहाउस में हवा बढ़ाएं।"],
//         mr: ["खालची पाने छाटा आणि पॉलीहाऊसमध्ये हवा खेळती ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Potassium Bicarbonate",
//             dosage: "4.0 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "पोटेशियम बाइकार्बोनेट",
//             dosage: "4.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "पोटॅशियम बायकार्बोनेट",
//             dosage: "४.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Difenoconazole 25% EC",
//             dosage: "0.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "डिफेनोकोनाज़ोल 25% EC",
//             dosage: "0.5 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डिफेनोकोनॅझोल २५% EC",
//             dosage: "०.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Maintain greenhouse relative humidity below 85%."],
//       hi: ["ग्रीनहाउस में नमी 85% से कम रखें।"],
//       mr: ["पॉलीहाऊसमध्ये हवेतील आर्द्रता ८५% पेक्षा कमी ठेवा."],
//     },
//   },

//   tomato_septoria_leaf_spot: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Septoria Leaf Spot (Septoria lycopersici)",
//       hi: "सेप्टोरिया पत्ती धब्बा रोग",
//       mr: "टोमॅटोवरील सेप्टोरिया ठिपके",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Small circular spots with gray centers and dark margins.",
//         "Tiny black pycnidia specks in center.",
//         "Progressive upward defoliation.",
//       ],
//       hi: [
//         "छोटे गोल धब्बे जिनका केंद्र धूसर और किनारे काले होते हैं।",
//         "बीच में काले बिंदु (फलन रचनाएं)।",
//         "निचली पत्तियों से शुरू होकर ऊपर तक गिरना।",
//       ],
//       mr: [
//         "पानांवर राखाडी केंद्राचे बारीक गोलाकार ठिपके.",
//         "डागांच्या मध्यभागी काळे सूक्ष्म बिंदू.",
//         "खालची पाने गळून वरपर्यंत पसरणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Remove and destroy infected bottom leaves."],
//         hi: ["निचली संक्रमित पत्तियों को तोड़कर नष्ट करें।"],
//         mr: ["खालची रोगट पाने काढून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Oxychloride 50% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर ऑक्सीक्लोराइड 50% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर ऑक्सिक्लोराईड ५०% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Chlorothalonil 75% WP or Mancozeb",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray every 10-14 days",
//           },
//         ],
//         hi: [
//           {
//             name: "क्लोरोथालोनिल 75% WP या मैंकोजेब",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "क्लोरोथालोनील किंवा मँकोझेब",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Clean stakes and cages between seasons.",
//         "Avoid working in wet fields.",
//       ],
//       hi: ["बांस और तारों को कीटाणुरहित करें।", "गीले पौधों पर काम न करें।"],
//       mr: [
//         "काठ्या व तारांचे निर्जंतुकीकरण करा.",
//         "पाने ओली असताना आंतरमशागत टाळा.",
//       ],
//     },
//   },

//   tomato_spider_mites: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Two-Spotted Spider Mites (Tetranychus urticae)",
//       hi: "लाल मकड़ी / माइट्स (Spider Mites)",
//       mr: "टोमॅटोवरील लाल कोळी (Spider Mites)",
//     },
//     pathogenType: "Pest",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Fine yellow stippling and speckling on leaves.",
//         "Silky webbing on leaf undersides.",
//         "Foliage bronzing and drying.",
//       ],
//       hi: [
//         "पत्तियों पर बारीक पीले बिंदु।",
//         "पत्ती के नीचे रेशमी जाले बनना।",
//         "पत्तियां तांबे जैसी होकर सूखना।",
//       ],
//       mr: [
//         "पानांवर पिवळे बारीक ठिपके पडणे.",
//         "पानाच्या पाठीमागे बारीक जाळे तयार होणे.",
//         "पाने तांबूस पडून वाळणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Hose down infested plants with high-pressure water spray."],
//         hi: ["तेज पानी की धार से पत्तियों के नीचे धोएं।"],
//         mr: ["पाण्याचा जोरदार फवारा मारून जाळे धुवून काढा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem oil 1500 ppm",
//             dosage: "5 ml/L",
//             applicationMethod: "Spray underside of leaves",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम का तेल (1500 ppm)",
//             dosage: "5 मिली/लीटर",
//             applicationMethod: "पत्तियों के निचले भाग पर छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी तेल १५०० ppm",
//             dosage: "५ मिली/लिटर",
//             applicationMethod: "पानांच्या खाली फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Spiromesifen 22.9% SC or Abamectin 1.9% EC",
//             dosage: "1.0 ml/L or 0.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "स्पाइरोमेसिफेन या अबामेक्टिन",
//             dosage: "1.0 मिली/लीटर या 0.5 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "स्पायरोमेसिफेन किंवा अबामेक्टिन",
//             dosage: "१.० मिली किंवा ०.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Avoid excessive nitrogen triggering mite surges.",
//         "Keep borders weed-free.",
//       ],
//       hi: [
//         "अत्यधिक यूरिया का उपयोग न करें।",
//         "खेत के किनारों को खरपतवार मुक्त रखें।",
//       ],
//       mr: ["नत्राचा अतिवापर टाळा.", "बांध तणमुक्त ठेवा."],
//     },
//   },

//   tomato_target_spot: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Target Spot (Corynespora cassiicola)",
//       hi: "टमाटर का टारगेट स्पॉट रोग",
//       mr: "टोमॅटोवरील टार्गेट स्पॉट",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Brown lesions with light centers expanding into target rings.",
//         "Fruit lesions with sunken centers.",
//         "Premature defoliation.",
//       ],
//       hi: [
//         "हल्के भूरे केंद्र वाले गोल निशाने जैसे छल्लेदार धब्बे।",
//         "फलों पर धंसे हुए गड्ढे।",
//         "पत्तियों का गिरना।",
//       ],
//       mr: [
//         "पानांवर निशाण्यासारखे गोल वलयाकार डाग.",
//         "फळांवर खोलगट व्रण.",
//         "पाने अकाली गळणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune suckers to improve canopy airflow."],
//         hi: ["अनावश्यक शाखाएं हटाकर हवा का संचार बढ़ाएं।"],
//         mr: ["अनावश्यक धुमारे छाटून हवा खेळती ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल",
//             dosage: "1.0 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "अझॉक्सीस्ट्रॉबिन + डिफेनोकोनॅझोल",
//             dosage: "१.० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Avoid prolonged leaf wetness.", "Use wide row spacing."],
//       hi: [
//         "पत्तियों को ज्यादा देर गीला न रहने दें।",
//         "पंक्तियों के बीच उचित दूरी रखें।",
//       ],
//       mr: [
//         "पानांवर जास्त वेळ ओलावा राहणार नाही याची काळजी घ्या.",
//         "ओळींमध्ये योग्य अंतर ठेवा.",
//       ],
//     },
//   },

//   tomato_mosaic_virus: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Tomato Mosaic Virus (ToMV)",
//       hi: "टमाटर मोजेक वायरस (ToMV)",
//       mr: "टोमॅटो मोझॅक व्हायरस (ToMV)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Mottling with alternating light and dark green areas.",
//         "Fern-leaf distortion and blistering.",
//         "Internal browning of fruit wall.",
//       ],
//       hi: [
//         "पत्तियों पर हल्के और गहरे हरे रंग के चितकबरे धब्बे।",
//         "पत्तियों का पतला मुड़ना।",
//         "फलों के अंदर भूरापन।",
//       ],
//       mr: [
//         "पानांवर पिवळसर-हिरवे चट्टे पडणे.",
//         "पाने बारीक होऊन वाकडी होणे.",
//         "फळांच्या आतील भाग तपकिरी पडणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Rogue out and incinerate infected plants immediately."],
//         hi: ["संक्रमित पौधों को तुरंत उखाड़कर जला दें।"],
//         mr: ["बाधित झाडे उपटून जाळून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Skim Milk Solution 20%",
//             dosage: "200 ml/L",
//             applicationMethod: "Dip tools/hands during handling",
//           },
//         ],
//         hi: [
//           {
//             name: "कच्चे दूध का 20% घोल",
//             dosage: "200 मिली/लीटर",
//             applicationMethod: "हाथ और औजार धोने के लिए",
//           },
//         ],
//         mr: [
//           {
//             name: "२०% दुधाचे पाणी",
//             dosage: "२०० मिली/लिटर",
//             applicationMethod: "हात व अवजारे धुण्यासाठी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [],
//         hi: [],
//         mr: [],
//       },
//     },
//     prevention: {
//       en: ["Disinfect tools in 10% TSP.", "Wash hands before touching plants."],
//       hi: [
//         "औजारों को ट्राइसोडियम फॉस्फेट से साफ करें।",
//         "काम करते समय हाथ धोएं।",
//       ],
//       mr: ["अवजारे निर्जंतुक करा.", "काम करताना स्वच्छता राखा."],
//     },
//   },

//   tomato_yellow_leaf_curl_virus: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Tomato Yellow Leaf Curl Virus (TYLCV)",
//       hi: "येलो लीफ कर्ल वायरस (पत्ती मरोड़ रोग)",
//       mr: "टोमॅटोवरील चुरडा-मुरडा (Yellow Leaf Curl)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Severe upward cupping and curling of leaflets.",
//         "Stunted bushy growth and yellowing.",
//         "Complete blossom drop.",
//       ],
//       hi: [
//         "पत्तियों का ऊपर की ओर मुड़ना और पीला पड़ना।",
//         "पौधे का बौना और झाड़ीदार होना।",
//         "फूलों का पूरी तरह झड़ना।",
//       ],
//       mr: [
//         "पाने वर वळतात, पिवळी पडतात.",
//         "रोपांची वाढ खुंटून झाड खुजे होते.",
//         "फुले गळून फळधारणा होत नाही.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Rogue out infected plants immediately in early crop cycle."],
//         hi: ["शुरुआती दिनों में रोगग्रस्त पौधों को तुरंत उखाड़ दें।"],
//         mr: ["सुरुवातीच्या काळात बाधित रोपे उपटून जाळून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Yellow sticky traps & Neem oil (10,000 ppm)",
//             dosage: "15 traps/acre | 3 ml/L",
//             applicationMethod: "Whitefly management",
//           },
//         ],
//         hi: [
//           {
//             name: "पीले स्टिकी ट्रैप और नीम का तेल",
//             dosage: "15 ट्रैप/एकड़ | 3 मिली/लीटर",
//             applicationMethod: "सफेद मक्खी नियंत्रण",
//           },
//         ],
//         mr: [
//           {
//             name: "पिवळे चिकट सापळे आणि निंबोळी तेल",
//             dosage: "१५ सापळे/एकर | ३ मिली/लिटर",
//             applicationMethod: "पांढऱ्या माशीसाठी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Diafenthiuron 50% WP or Cyantraniliprole 10.26% OD",
//             dosage: "1.5 g/L or 1.8 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "डायफेनथियूरॉन 50% WP",
//             dosage: "1.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "डायफेनथियुरॉन ५०% WP",
//             dosage: "१.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Install 50-mesh insect-proof netting in nurseries.",
//         "Grow resistant hybrids.",
//       ],
//       hi: [
//         "नर्सरी में 50-मेश जाली का उपयोग करें।",
//         "प्रतिरोधी किस्मों की खेती करें।",
//       ],
//       mr: ["रोपवाटिकेत ५०-मेश जाळीचा वापर करा.", "प्रतिकारक संकरित वाण लावा."],
//     },
//   },

//   tomato_leaf_blight: {
//     crop: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//     diseaseName: {
//       en: "Tomato Leaf Blight",
//       hi: "टमाटर पत्ती झुलसा",
//       mr: "टोमॅटोवरील करपा",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Rapid browning and scorching of leaf margins.",
//         "Dark blighted patches across older and younger leaves.",
//       ],
//       hi: [
//         "पत्तियों के किनारों का तेजी से भूरा होकर जलना।",
//         "पत्तियों पर बड़े झुलसे हुए धब्बे।",
//       ],
//       mr: [
//         "पानांच्या कडा करपून तपकिरी होतात.",
//         "पानांवर मोठे करपलेले चट्टे दिसतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Prune blighted foliage."],
//         hi: ["झुलसी हुई पत्तियों को तोड़ें।"],
//         mr: ["करपलेली पाने काढून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Copper Hydroxide 53.8% DF",
//             dosage: "2.0 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "कॉपर हाइड्रोक्साइड",
//             dosage: "2.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "कॉपर हायड्रॉक्साईड",
//             dosage: "२.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब ७५% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Ensure airflow through trellising.", "Avoid splash irrigation."],
//       hi: [
//         "हवा के संचार के लिए पौधों को सहारा दें।",
//         "पानी के छींटों से बचाएं।",
//       ],
//       mr: ["झाडांना आधार देऊन हवा खेळती ठेवा.", "तुषार सिंचन टाळा."],
//     },
//   },

//   maize_leaf_spot: {
//     crop: { en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//     diseaseName: {
//       en: "Maize Leaf Spot (Bipolaris / Helminthosporium)",
//       hi: "मक्का पत्ती धब्बा रोग",
//       mr: "मक्यावरील पानांवरील ठिपके",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Small oval to circular brown spots on lower leaves.",
//         "Lesions coalesce forming larger blighted areas.",
//       ],
//       hi: [
//         "निचली पत्तियों पर छोटे गोल से अंडाकार भूरे धब्बे।",
//         "धब्बे मिलकर पत्तियों को झुलसा देते हैं।",
//       ],
//       mr: [
//         "खालच्या पानांवर लहान लंबगोलाकार तपकिरी डाग.",
//         "डाग एकत्र येऊन पाने करपतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Maintain optimal field spacing for airflow."],
//         hi: ["हवा के लिए पौधों में उचित दूरी रखें।"],
//         mr: ["हवा खेळती राहण्यासाठी योग्य अंतर ठेवा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Pseudomonas fluorescens",
//             dosage: "10 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "स्यूडोमोनास फ्लोरोसेंस",
//             dosage: "10 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "सुडोमोनास फ्लोरोसन्स",
//             dosage: "१० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Mancozeb 75% WP",
//             dosage: "2.5 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "मैंकोजेब 75% WP",
//             dosage: "2.5 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "मँकोझेब ७५% WP",
//             dosage: "२.५ ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Rotate with non-host legumes.", "Treat seeds before sowing."],
//       hi: ["दलहनी फसलों के साथ फसल चक्र अपनाएं।", "बीजोपचार करें।"],
//       mr: ["कडधान्य पिकांसोबत फेरपालट करा.", "पेरणीपूर्वी बीजप्रक्रिया करा."],
//     },
//   },

//   maize_streak_virus: {
//     crop: { en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//     diseaseName: {
//       en: "Maize Streak Virus (MSV)",
//       hi: "मक्का स्ट्रीक वायरस (धारीदार रोग)",
//       mr: "मक्यावरील स्ट्रीक व्हायरस (पट्टेदार रोग)",
//     },
//     pathogenType: "Viral",
//     severityLevel: "High",
//     symptoms: {
//       en: [
//         "Continuous narrow yellow/white streaks parallel to leaf veins.",
//         "Severe plant stunting and small undeveloped cobs.",
//       ],
//       hi: [
//         "पत्तियों की नसों के समानांतर पीली और सफेद धारियां।",
//         "पौधे का अत्यधिक बौना होना और भुट्टे न बनना।",
//       ],
//       mr: [
//         "पानांच्या शिरांना समांतर पिवळ्या-पांढऱ्या बारीक रेषा.",
//         "झाडाची वाढ खुंटणे आणि कणीस न भरणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Uproot infected seedlings immediately."],
//         hi: ["संक्रमित छोटे पौधों को तुरंत उखाड़कर नष्ट करें।"],
//         mr: ["रोगट झाडे त्वरित उपटून टाका."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Neem oil 10,000 ppm",
//             dosage: "3 ml/L",
//             applicationMethod: "Target leafhopper vectors",
//           },
//         ],
//         hi: [
//           {
//             name: "नीम का तेल",
//             dosage: "3 मिली/लीटर",
//             applicationMethod: "लीफहॉपर कीट नियंत्रण",
//           },
//         ],
//         mr: [
//           {
//             name: "निंबोळी तेल",
//             dosage: "३ मिली/लिटर",
//             applicationMethod: "तुडतुडे नियंत्रणासाठी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Imidacloprid 17.8% SL",
//             dosage: "0.5 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "इमिडाक्लोप्रिड 17.8% SL",
//             dosage: "0.5 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "इमिडाक्लोप्रिड १७.८% SL",
//             dosage: "०.५ मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Seed treatment with Thiamethoxam.",
//         "Control cicadellid leafhopper vectors.",
//       ],
//       hi: ["थियामेथोक्सम से बीजोपचार करें।", "कीटों का समय पर नियंत्रण करें।"],
//       mr: [
//         "पेरणीपूर्वी बीजप्रक्रिया करा.",
//         "तुडतुड्यांचे वेळेवर नियंत्रण करा.",
//       ],
//     },
//   },

//   wheat_brown_rust: {
//     crop: { en: "Wheat", hi: "गेहूं", mr: "गहू" },
//     diseaseName: {
//       en: "Brown Rust / Leaf Rust (Puccinia triticina)",
//       hi: "गेहूं का भूरा रतुआ / लीफ रस्ट",
//       mr: "गव्हावरील तपकिरी तांबेरा",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "Round to oval bright orange-brown pustules scattered randomly across leaves.",
//         "Powdery brown spores rub off easily on fingertips.",
//         "Early drying of flag leaf.",
//       ],
//       hi: [
//         "पत्तियों पर अनियमित रूप से बिखरे हुए गोल नारंगी-भूरे फफोले।",
//         "छूने पर भूरा पाउडर उंगलियों पर लगता है।",
//         "झंडा पत्ती का सूखना जिससे दाने पतले रहते हैं।",
//       ],
//       mr: [
//         "पानांवर केशरी-तपकिरी रंगाचे लहान पुरळ विखुरलेले दिसतात.",
//         "बोटांना तांबूस भुकटी सहज लागते.",
//         "ध्वज पान (Flag leaf) अकाली वाळल्यामुळे दाणे बारीक राहतात.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Scout field for flag leaf pustules."],
//         hi: ["झंडा पत्ती (flag leaf) पर फफोलों की तुरंत जांच करें।"],
//         mr: ["गव्हाच्या वरच्या पानांचे नियमित निरीक्षण करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Fermented Buttermilk spray",
//             dosage: "5 L/acre in 200 L water",
//             applicationMethod: "Morning foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "खट्टी छाछ का छिड़काव",
//             dosage: "5 लीटर/एकड़",
//             applicationMethod: "सुबह पत्तियों पर",
//           },
//         ],
//         mr: [
//           {
//             name: "आंबट ताकाची फवारणी",
//             dosage: "५ लिटर/एकर",
//             applicationMethod: "सकाळी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Propiconazole 25% EC",
//             dosage: "1.0 ml/L (200 ml/acre)",
//             applicationMethod: "Foliar spray at disease appearance",
//           },
//         ],
//         hi: [
//           {
//             name: "प्रोपिकोनाज़ोल 25% EC",
//             dosage: "1.0 मिली/लीटर (200 ml/एकड़)",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "प्रोपिकोनाझोल २५% EC",
//             dosage: "१.० मिली/लिटर (२०० मिली/एकर)",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Avoid late sowing.", "Ensure balanced N:P:K ratios."],
//       hi: ["देर से बुआई न करें।", "संतुलित खाद दें और अत्यधिक यूरिया से बचें।"],
//       mr: ["वेळेवर पेरणी करा.", "नत्राचा अतिवापर टाळा आणि संतुलित खते द्या."],
//     },
//   },

//   wheat_yellow_rust: {
//     crop: { en: "Wheat", hi: "गेहूं", mr: "गहू" },
//     diseaseName: {
//       en: "Yellow Rust / Stripe Rust (Puccinia striiformis)",
//       hi: "गेहूं का पीला रतुआ / स्ट्राइप रस्ट",
//       mr: "गव्हावरील पिवळा तांबेरा (Yellow Rust)",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Critical",
//     symptoms: {
//       en: [
//         "Yellow pustules arranged in parallel linear stripes along leaf veins.",
//         "Powder rubs off easily on clothes or skin.",
//         "Extensive leaf desiccation.",
//       ],
//       hi: [
//         "पत्तियों पर सीधी धारियों में पीले फफोले।",
//         "छूने पर पीला पाउडर कपड़ों या उंगलियों पर लगता है।",
//         "पत्तियों का तेजी से सूखना और उपज में भारी गिरावट।",
//       ],
//       mr: [
//         "पानांवर पिवळ्या रंगाचे पुरळ सरळ पट्ट्यांमध्ये दिसतात.",
//         "बोटांना पिवळी भुकटी सहज लागते.",
//         "पाने वाळल्यामुळे उत्पादनात मोठी घट होते.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: [
//           "Isolate infected patch; avoid walking across fields to prevent spore transfer.",
//         ],
//         hi: [
//           "रोगग्रस्त हिस्से में जाने से बचें ताकि बीजाणु कपड़ों से न फैलें।",
//         ],
//         mr: ["रोग पसरू नये म्हणून शेतातून ये-जा करताना काळजी घ्या."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Fermented buttermilk foliar wash",
//             dosage: "5 L/acre in water",
//             applicationMethod: "Early morning spray",
//           },
//         ],
//         hi: [
//           {
//             name: "खट्टी छाछ",
//             dosage: "5 लीटर/एकड़",
//             applicationMethod: "सुबह के समय छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "आंबट ताक",
//             dosage: "५ लिटर/एकर",
//             applicationMethod: "सकाळच्या वेळी फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Propiconazole 25% EC (Tilt)",
//             dosage: "1.0 ml/L (200 ml/acre)",
//             applicationMethod: "Immediate foliar spray upon detection",
//           },
//         ],
//         hi: [
//           {
//             name: "प्रोपिकोनाज़ोल 25% EC (टिल्ट)",
//             dosage: "1.0 मिली/लीटर (200 ml/एकड़)",
//             applicationMethod: "लक्षण दिखते ही तुरंत छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "प्रोपिकोनाझोल २५% EC (टिल्ट)",
//             dosage: "१.० मिली/लिटर (२०० मिली/एकर)",
//             applicationMethod: "लक्षणे दिसताच फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: [
//         "Sow rust-resistant varieties (HD 2967, PBW 550).",
//         "Do not over-apply urea.",
//       ],
//       hi: [
//         "पीला रतुआ प्रतिरोधी किस्मों (जैसे HD 2967) की ही बुआई करें।",
//         "यूरिया का अत्यधिक प्रयोग न करें।",
//       ],
//       mr: [
//         "प्रतिबंधक वाणांचीच (उदा. HD 2967) पेरणी करा.",
//         "युरियाचा अतिवापर टाळा.",
//       ],
//     },
//   },

//   wheat_powdery_mildew: {
//     crop: { en: "Wheat", hi: "गेहूं", mr: "गहू" },
//     diseaseName: {
//       en: "Powdery Mildew (Blumeria graminis)",
//       hi: "चूर्णिल आसिता (Powdery Mildew)",
//       mr: "गव्हावरील भुरी रोग",
//     },
//     pathogenType: "Fungal",
//     severityLevel: "Moderate",
//     symptoms: {
//       en: [
//         "White powdery fungal patches on leaves and stems.",
//         "Premature yellowing and drying of lower leaves.",
//       ],
//       hi: [
//         "पत्तियों और तनों पर सफेद पाउडर जैसी फफूंद के धब्बे।",
//         "निचली पत्तियों का समय से पहले पीला पड़कर सूखना।",
//       ],
//       mr: [
//         "पानांवर आणि देठांवर पांढऱ्या पावडरीसारख्या बुरशीचे डाग.",
//         "खालची पाने पिवळी पडून लवकर वाळणे.",
//       ],
//     },
//     treatmentPlan: {
//       immediateAction: {
//         en: ["Reduce canopy density if possible to improve air circulation."],
//         hi: ["हवा के संचार के लिए खेत में अत्यधिक घनी फसल को सुधारें।"],
//         mr: ["हवा खेळती राहण्यासाठी उपाययोजना करा."],
//       },
//       organicRemedies: {
//         en: [
//           {
//             name: "Wettable Sulfur",
//             dosage: "3.0 g/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "घुलनशील गंधक (Sulfur)",
//             dosage: "3.0 ग्राम/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "पाण्यात विरघळणारे गंधक",
//             dosage: "३.० ग्रॅम/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//       chemicalRemedies: {
//         en: [
//           {
//             name: "Tebuconazole 25.9% EC",
//             dosage: "1.0 ml/L",
//             applicationMethod: "Foliar spray",
//           },
//         ],
//         hi: [
//           {
//             name: "टेबुकोनाज़ोल 25.9% EC",
//             dosage: "1.0 मिली/लीटर",
//             applicationMethod: "छिड़काव",
//           },
//         ],
//         mr: [
//           {
//             name: "तेबुकोनॅझोल २५.९% EC",
//             dosage: "१.० मिली/लिटर",
//             applicationMethod: "फवारणी",
//           },
//         ],
//       },
//     },
//     prevention: {
//       en: ["Avoid excess nitrogenous fertilizers."],
//       hi: ["नत्र (नाइट्रोजन) युक्त खादों का अत्यधिक प्रयोग न करें।"],
//       mr: ["नत्रयुक्त खतांचा अतिवापर टाळा."],
//     },
//   },
// };

// // 3. Complete List of 22 Healthy Classes to Generate
// const HEALTHY_CLASSES = [
//   { id: "apple_healthy", en: "Apple", hi: "सेब", mr: "सफरचंद" },
//   { id: "blueberry_healthy", en: "Blueberry", hi: "ब्लूबेरी", mr: "ब्लूबेरी" },
//   { id: "cashew_healthy", en: "Cashew", hi: "काजू", mr: "काजू" },
//   { id: "cassava_healthy", en: "Cassava", hi: "कसावा", mr: "कसाव्हा" },
//   { id: "cherry_healthy", en: "Cherry", hi: "चेरी", mr: "चेरी" },
//   { id: "chilli_healthy", en: "Chilli", hi: "मिर्च", mr: "मिरची" },
//   { id: "citrus_healthy", en: "Citrus", hi: "नींबू वर्गीय", mr: "लिंबूवर्गीय" },
//   { id: "maize_healthy", en: "Corn / Maize", hi: "मक्का", mr: "मका" },
//   { id: "cotton_healthy", en: "Cotton", hi: "कपास", mr: "कापूस" },
//   { id: "grape_healthy", en: "Grape", hi: "अंगूर", mr: "द्राक्ष" },
//   { id: "groundnut_healthy", en: "Groundnut", hi: "मूंगफली", mr: "भुईमूग" },
//   { id: "papaya_healthy", en: "Papaya", hi: "पपीता", mr: "पपई" },
//   { id: "peach_healthy", en: "Peach", hi: "आड़ू", mr: "पीच" },
//   {
//     id: "pepper_bell_healthy",
//     en: "Bell Pepper",
//     hi: "शिमला मिर्च",
//     mr: "ढोबळी मिरची",
//   },
//   { id: "potato_healthy", en: "Potato", hi: "आलू", mr: "बटाटा" },
//   { id: "raspberry_healthy", en: "Raspberry", hi: "रसभरी", mr: "रासबेरी" },
//   { id: "rice_healthy", en: "Rice", hi: "धान", mr: "भात" },
//   { id: "soybean_healthy", en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },
//   {
//     id: "strawberry_healthy",
//     en: "Strawberry",
//     hi: "स्ट्रॉबेरी",
//     mr: "स्ट्रॉबेरी",
//   },
//   { id: "sugarcane_healthy", en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
//   { id: "tomato_healthy", en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
//   { id: "wheat_healthy", en: "Wheat", hi: "गेहूं", mr: "गहू" },
// ];

// // 4. Assemble the Master JSON Object
// const finalJSON = {};

// for (const item of HEALTHY_CLASSES) {
//   finalJSON[item.id] = createHealthy(item.id, item.en, item.hi, item.mr);
// }

// for (const [key, d] of Object.entries(DISEASES)) {
//   finalJSON[key] = {
//     en: {
//       id: key,
//       crop: d.crop.en,
//       diseaseName: d.diseaseName.en,
//       pathogenType: d.pathogenType,
//       severityLevel: d.severityLevel,
//       symptoms: d.symptoms.en,
//       treatmentPlan: {
//         immediateAction: d.treatmentPlan.immediateAction.en,
//         organicRemedies: d.treatmentPlan.organicRemedies.en,
//         chemicalRemedies: d.treatmentPlan.chemicalRemedies.en,
//       },
//       prevention: d.prevention.en,
//     },
//     hi: {
//       id: key,
//       crop: d.crop.hi,
//       diseaseName: d.diseaseName.hi,
//       pathogenType: d.pathogenType,
//       severityLevel: d.severityLevel,
//       symptoms: d.symptoms.hi,
//       treatmentPlan: {
//         immediateAction: d.treatmentPlan.immediateAction.hi,
//         organicRemedies: d.treatmentPlan.organicRemedies.hi,
//         chemicalRemedies: d.treatmentPlan.chemicalRemedies.hi,
//       },
//       prevention: d.prevention.hi,
//     },
//     mr: {
//       id: key,
//       crop: d.crop.mr,
//       diseaseName: d.diseaseName.mr,
//       pathogenType: d.pathogenType,
//       severityLevel: d.severityLevel,
//       symptoms: d.symptoms.mr,
//       treatmentPlan: {
//         immediateAction: d.treatmentPlan.immediateAction.mr,
//         organicRemedies: d.treatmentPlan.organicRemedies.mr,
//         chemicalRemedies: d.treatmentPlan.chemicalRemedies.mr,
//       },
//       prevention: d.prevention.mr,
//     },
//   };
// }

// // 5. Verification & Output
// const totalKeys = Object.keys(finalJSON).length;
// console.log(`\n==================================================`);
// console.log(`AgroVision Database Verification:`);
// console.log(`Total Classes Processed: ${totalKeys} / 75`);
// console.log(`Healthy Classes: ${HEALTHY_CLASSES.length}`);
// console.log(`Disease Classes: ${Object.keys(DISEASES).length}`);
// console.log(`==================================================\n`);

// if (totalKeys !== 75) {
//   console.error(`❌ ERROR: Expected 75 classes, found ${totalKeys}.`);
//   process.exit(1);
// }

// const targets = [
//   path.join(process.cwd(), "public", "data", "crop_diseases_75.json"),
//   path.join(process.cwd(), "crop_diseases_75.json"),
// ];

// targets.forEach((dest) => {
//   const dir = path.dirname(dest);
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
//   fs.writeFileSync(dest, JSON.stringify(finalJSON, null, 2), "utf8");
//   console.log(`✅ Successfully generated: ${dest}`);
// });

// console.log(`\n🎉 DONE! All 75 classes successfully written and validated.`);
