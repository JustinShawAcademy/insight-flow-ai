// frontend/app/page.tsx
"use client"; // Required for hooks like useEffect

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCcw } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [message, setMessage] = useState("");

  const checkHealth = async () => {
    setStatus("loading");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/health`);
      
      if (res.ok) {
        const data = await res.json();
        setStatus("online");
        setMessage(data.message);
      } else {
        setStatus("offline");
      }
    } catch (error) {
      console.error("Connection error:", error);
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <Card  className="w-[350px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className={`h-4 w-4 ${status === 'online' ? 'text-green-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">Backend</span>
              {status === "loading" && <Badge variant="outline">Checking...</Badge>}
              {status === "online" && <Badge className="bg-green-500">Connected</Badge>}
              {status === "offline" && <Badge variant="destructive">Disconnected</Badge>}
            </div>
            
            <p className="text-xs text-muted-foreground">
              {status === "online" ? message : "Could not connect to FastAPI at http://localhost:8000"}
            </p>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkHealth}
              disabled={status === "loading"}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Re-check
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}