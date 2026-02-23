"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

// ============================================
// SOFTWARE DEVELOPMENT WIDGET
// Animated system architecture diagram
// ============================================
export function SoftwareDevWidget() {
  const [activeConnection, setActiveConnection] = useState(0);
  const sw = useT("serviceWidgets");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnection((prev) => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { id: "frontend", label: sw.frontend, x: 50, y: 20, icon: "monitor" },
    { id: "api", label: sw.apiGateway, x: 50, y: 50, icon: "server" },
    { id: "auth", label: sw.auth, x: 20, y: 50, icon: "lock" },
    { id: "db", label: sw.database, x: 80, y: 50, icon: "database" },
    { id: "cache", label: sw.cache, x: 20, y: 80, icon: "zap" },
    { id: "storage", label: sw.storage, x: 80, y: 80, icon: "cloud" },
  ];

  const connections = [
    { from: "frontend", to: "api" },
    { from: "api", to: "auth" },
    { from: "api", to: "db" },
    { from: "api", to: "cache" },
    { from: "api", to: "storage" },
    { from: "db", to: "cache" },
  ];

  const getNodePos = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="relative w-full h-full">
      {/* Glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl" />

      {/* Architecture diagram */}
      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="ml-4 text-xs text-text-muted">system-architecture.diagram</span>
        </div>

        {/* SVG Canvas */}
        <svg className="w-full h-[calc(100%-40px)]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = getNodePos(conn.from);
            const to = getNodePos(conn.to);
            if (!from || !to) return null;
            const isActive = i === activeConnection;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActive ? "#BFF747" : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? 0.5 : 0.3}
                  strokeDasharray={isActive ? "none" : "2,2"}
                />
                {isActive && (
                  <motion.circle
                    r="1"
                    fill="#BFF747"
                    initial={{ cx: from.x, cy: from.y }}
                    animate={{ cx: to.x, cy: to.y }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <motion.rect
                x={node.x - 8}
                y={node.y - 6}
                width="16"
                height="12"
                rx="2"
                fill="rgba(255,255,255,0.05)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.3"
                whileHover={{ scale: 1.1 }}
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                className="fill-theme text-[3px] font-medium"
              >
                {node.icon === "monitor" && "⬡"}
                {node.icon === "server" && "◈"}
                {node.icon === "lock" && "◉"}
                {node.icon === "database" && "▣"}
                {node.icon === "zap" && "◇"}
                {node.icon === "cloud" && "☁"}
              </text>
              <text
                x={node.x}
                y={node.y + 9}
                textAnchor="middle"
                className="fill-text-muted text-[2.5px]"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Status indicator */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-green-400">{sw.allSystemsOperational}</span>
          </div>
          <div className="text-[10px] text-text-muted">
            <span className="text-theme">6</span> {sw.microservices}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AI SOLUTIONS WIDGET
// Neural network with animated data flow
// ============================================
export function AISolutionsWidget() {
  const [processingStep, setProcessingStep] = useState(0);
  const sw = useT("serviceWidgets");

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const steps = [sw.input, sw.processing, sw.analysis, sw.output];
  const prompts = [
    sw.promptAnalyzing,
    sw.promptTraining,
    sw.promptGenerating,
    sw.promptOptimizing,
  ];

  return (
    <div className="relative w-full h-full">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(191,247,71,0.15),transparent_70%)]" />

      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-6 h-6 rounded-lg bg-theme/20 flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-4 h-4 text-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
            <span className="text-xs font-medium text-text-header">{sw.aiEngine}</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-theme"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] text-theme">{sw.active}</span>
          </div>
        </div>

        {/* Neural network visualization */}
        <div className="p-4 h-[calc(100%-40px)] flex flex-col">
          {/* Processing steps */}
          <div className="flex justify-between mb-6">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                    i <= processingStep
                      ? "bg-theme/20 border-theme/50 text-theme"
                      : "bg-white/5 border-white/10 text-text-muted"
                  )}
                  animate={i === processingStep ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {i === 0 && <InputIcon />}
                  {i === 1 && <ProcessIcon />}
                  {i === 2 && <AnalyzeIcon />}
                  {i === 3 && <OutputIcon />}
                </motion.div>
                <span className={cn(
                  "text-[10px] transition-colors",
                  i <= processingStep ? "text-theme" : "text-text-muted"
                )}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Connection line */}
          <div className="relative h-1 bg-white/10 rounded-full mb-6 mx-6">
            <motion.div
              className="absolute left-0 top-0 h-full bg-theme rounded-full"
              animate={{ width: `${((processingStep + 1) / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Live terminal output */}
          <div className="flex-1 bg-black/50 rounded-lg p-3 font-mono text-[10px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={processingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                <div className="text-text-muted">
                  <span className="text-theme">$</span> {prompts[processingStep]}
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    className="inline-block w-2 h-3 bg-theme"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats row */}
          <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-lg font-bold text-theme">98.5%</div>
              <div className="text-[9px] text-text-muted">{sw.accuracy}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-header">2.4M</div>
              <div className="text-[9px] text-text-muted">{sw.dataPoints}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-header">24ms</div>
              <div className="text-[9px] text-text-muted">{sw.response}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DIGITAL MARKETING WIDGET
// Live campaign dashboard with analytics
// ============================================
export function DigitalMarketingWidget() {
  const [selectedChannel, setSelectedChannel] = useState(0);
  const sw = useT("serviceWidgets");

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedChannel((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const channels = [
    { name: sw.social, color: "#E91E63", value: 42, icon: "share" },
    { name: sw.email, color: "#2196F3", value: 28, icon: "mail" },
    { name: sw.organic, color: "#4CAF50", value: 18, icon: "search" },
    { name: sw.referral, color: "#FF9800", value: 12, icon: "link" },
  ];

  const chartData = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      month: i,
      value: 30 + Math.sin(i * 0.8) * 20 + Math.random() * 10,
    })),
  []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 rounded-3xl" />

      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium text-text-header">{sw.campaignDashboard}</span>
          </div>
          <span className="text-[10px] text-text-muted">{sw.last30Days}</span>
        </div>

        <div className="p-4 h-[calc(100%-40px)] flex flex-col gap-4">
          {/* Top metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: sw.reach, value: "847K", change: "+23%" },
              { label: sw.engagement, value: "12.4%", change: "+8%" },
              { label: sw.conversions, value: "2,847", change: "+31%" },
            ].map((metric) => (
              <div key={metric.label} className="bg-white/5 rounded-lg p-2 text-center">
                <div className="text-[10px] text-text-muted">{metric.label}</div>
                <div className="text-sm font-bold text-text-header">{metric.value}</div>
                <div className="text-[9px] text-green-400">{metric.change}</div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div className="flex-1 relative">
            <svg className="w-full h-full" viewBox="0 0 120 50" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50].map((y) => (
                <line key={y} x1="0" y1={y} x2="120" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              ))}

              {/* Area fill */}
              <motion.path
                d={`M0,50 ${chartData.map((d, i) => `L${i * 10},${50 - d.value}`).join(" ")} L110,50 Z`}
                fill="url(#chartGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />

              {/* Line */}
              <motion.path
                d={`M0,${50 - chartData[0].value} ${chartData.map((d, i) => `L${i * 10},${50 - d.value}`).join(" ")}`}
                fill="none"
                stroke="#BFF747"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2 }}
              />

              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#BFF747" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#BFF747" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Channel breakdown */}
          <div className="space-y-2">
            <div className="text-[10px] text-text-muted mb-2">{sw.trafficSources}</div>
            <div className="flex gap-1 h-3 rounded-full overflow-hidden">
              {channels.map((channel, i) => (
                <motion.div
                  key={channel.name}
                  className="h-full"
                  style={{ backgroundColor: channel.color, width: `${channel.value}%` }}
                  animate={{ opacity: i === selectedChannel ? 1 : 0.6 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {channels.map((channel, i) => (
                <motion.div
                  key={channel.name}
                  className={cn(
                    "text-center transition-all",
                    i === selectedChannel ? "scale-110" : "opacity-60"
                  )}
                >
                  <div className="text-[9px]" style={{ color: channel.color }}>{channel.name}</div>
                  <div className="text-[10px] font-semibold text-text-header">{channel.value}%</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAID ADVERTISING WIDGET
// Real-time ad performance metrics
// ============================================
export function PaidAdvertisingWidget() {
  const sw = useT("serviceWidgets");
  const [metrics, setMetrics] = useState({
    spend: 12847,
    impressions: 2400000,
    clicks: 48200,
    conversions: 1247,
    roas: 4.2,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        spend: prev.spend + Math.floor(Math.random() * 50),
        impressions: prev.impressions + Math.floor(Math.random() * 5000),
        clicks: prev.clicks + Math.floor(Math.random() * 100),
        conversions: prev.conversions + (Math.random() > 0.7 ? 1 : 0),
        roas: 4.1 + Math.random() * 0.3,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const platforms = [
    { name: "Google", spend: 45, color: "#4285F4" },
    { name: "Meta", spend: 35, color: "#0668E1" },
    { name: "LinkedIn", spend: 15, color: "#0A66C2" },
    { name: "TikTok", spend: 5, color: "#FF0050" },
  ];

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10 rounded-3xl" />

      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-text-header">{sw.adPerformance}</span>
          </div>
          <div className="flex items-center gap-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-[10px] text-green-400">{sw.live}</span>
          </div>
        </div>

        <div className="p-4 h-[calc(100%-40px)] flex flex-col gap-3">
          {/* ROAS highlight */}
          <div className="bg-gradient-to-r from-theme/20 to-theme/5 rounded-xl p-4 text-center border border-theme/20">
            <div className="text-[10px] text-text-muted mb-1">{sw.returnOnAdSpend}</div>
            <motion.div
              className="text-4xl font-bold text-theme"
              key={metrics.roas.toFixed(1)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {metrics.roas.toFixed(1)}x
            </motion.div>
            <div className="text-[10px] text-green-400 mt-1">{sw.vsLastMonth}</div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: sw.adSpend, value: `$${(metrics.spend / 1000).toFixed(1)}K`, icon: "dollar" },
              { label: sw.impressions, value: `${(metrics.impressions / 1000000).toFixed(1)}M`, icon: "eye" },
              { label: sw.clicks, value: `${(metrics.clicks / 1000).toFixed(1)}K`, icon: "cursor" },
              { label: sw.conversions, value: metrics.conversions.toLocaleString(), icon: "check" },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                className="bg-white/5 rounded-lg p-3 border border-white/5"
                whileHover={{ borderColor: "rgba(191,247,71,0.3)" }}
              >
                <div className="text-[9px] text-text-muted">{metric.label}</div>
                <motion.div
                  className="text-lg font-bold text-text-header"
                  key={metric.value}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {metric.value}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Platform breakdown */}
          <div className="mt-auto">
            <div className="text-[10px] text-text-muted mb-2">{sw.spendByPlatform}</div>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted w-14">{platform.name}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: platform.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.spend}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  <span className="text-[10px] text-text-header w-8 text-right">{platform.spend}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SEO WIDGET
// Search rankings visualization
// ============================================
export function SEOWidget() {
  const sw = useT("serviceWidgets");
  const [animatedRanks, setAnimatedRanks] = useState([12, 8, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedRanks((prev) =>
        prev.map((rank) => Math.max(1, rank - (Math.random() > 0.5 ? 1 : 0)))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const keywords = [
    { keyword: "web development services", rank: animatedRanks[0], volume: "12K", change: -4 },
    { keyword: "custom software company", rank: animatedRanks[1], volume: "8.2K", change: -2 },
    { keyword: "ai automation agency", rank: animatedRanks[2], volume: "5.4K", change: -6 },
  ];

  const organicGrowth = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      visitors: 1200 + i * 150 + Math.random() * 200,
    })),
  []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-3xl" />

      <div className="absolute inset-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs font-medium text-text-header">{sw.seoRankings}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-[10px] text-emerald-400">{sw.rising}</span>
          </div>
        </div>

        <div className="p-4 h-[calc(100%-40px)] flex flex-col gap-3">
          {/* Keyword rankings */}
          <div className="space-y-2">
            {keywords.map((kw, i) => (
              <motion.div
                key={kw.keyword}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    kw.rank <= 3 ? "bg-theme/20 text-theme" : "bg-white/10 text-text-header"
                  )}
                  key={kw.rank}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  #{kw.rank}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-text-header truncate">{kw.keyword}</div>
                  <div className="text-[9px] text-text-muted">{kw.volume}/mo</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-[10px]">{Math.abs(kw.change)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Organic traffic chart */}
          <div className="flex-1 mt-2">
            <div className="text-[10px] text-text-muted mb-2">{sw.organicTrafficThisWeek}</div>
            <div className="flex items-end justify-between h-16 gap-1">
              {organicGrowth.map((day, i) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full bg-gradient-to-t from-emerald-500/50 to-emerald-400/50 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.visitors / 2500) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                  <span className="text-[8px] text-text-muted">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
            <div className="text-center">
              <div className="text-lg font-bold text-theme">#1</div>
              <div className="text-[9px] text-text-muted">{sw.topRanking}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-header">+312%</div>
              <div className="text-[9px] text-text-muted">{sw.trafficGrowth}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-text-header">847</div>
              <div className="text-[9px] text-text-muted">{sw.keywords}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER ICONS
// ============================================
function InputIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

function ProcessIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function AnalyzeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function OutputIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
