"use client";

import React from "react";
import { AITelemetry } from "@/types/admin";
import { MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  data: AITelemetry | null;
  loading: boolean;
}

export default function LiveAuditFeed({ data, loading }: Props) {
  if (loading || !data) {
    return <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Live AI Consultations</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-4">
          {data.logs.map((log, index) => (
            <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="mt-1">
                {log.resolved ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900">{log.query_intent}</p>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono uppercase">
                    {log.language}
                  </span>
                  <span className="text-xs text-slate-500">
                    {log.resolved ? "Resolved autonomously" : "Requires human review"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {data.logs.length === 0 && (
            <div className="text-center text-slate-500 font-medium py-8">
              No recent AI activity.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
