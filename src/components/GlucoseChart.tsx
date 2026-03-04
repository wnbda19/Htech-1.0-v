// ─────────────────────────────────────────────────
// Htech · GlucoseChart Component
// Canvas-based glucose trend chart
// ─────────────────────────────────────────────────

import { useRef, useEffect } from 'react';
import type { GlucoseReading } from '../types';
import { useLanguage } from '../hooks';
import { GLUCOSE_THRESHOLDS } from '../contexts/ReadingsContext';

interface GlucoseChartProps {
    readonly readings: readonly GlucoseReading[];
    readonly height?: number;
}

export function GlucoseChart({ readings, height = 200 }: GlucoseChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const padding = { top: 20, right: 20, bottom: 30, left: 45 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, w, h);

        if (readings.length === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '14px Inter, Tajawal, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(t('no_readings_chart'), w / 2, h / 2);
            return;
        }

        // Sort readings oldest first
        const sorted = [...readings]
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .slice(-20); // Last 20 readings

        const values = sorted.map((r) => r.value);
        const minVal = Math.min(40, ...values);
        const maxVal = Math.max(350, ...values);
        const range = maxVal - minVal;

        // Helper for coordinates
        const getX = (i: number) => {
            const x = padding.left + (i / Math.max(sorted.length - 1, 1)) * chartW;
            return isRTL ? w - x + padding.left - padding.right : x;
        };
        const getY = (val: number) =>
            padding.top + chartH - ((val - minVal) / range) * chartH;

        // Draw safe range band (70-180)
        const safeTop = getY(GLUCOSE_THRESHOLDS.normalMax);
        const safeBottom = getY(GLUCOSE_THRESHOLDS.normalMin);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.06)';
        ctx.fillRect(padding.left, safeTop, chartW, safeBottom - safeTop);

        // Draw safe range borders
        ctx.strokeStyle = 'rgba(0, 212, 170, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        [GLUCOSE_THRESHOLDS.normalMin, GLUCOSE_THRESHOLDS.normalMax].forEach((threshold) => {
            const y = getY(threshold);
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartW, y);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Y-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '11px Inter, Tajawal, sans-serif';
        ctx.textAlign = isRTL ? 'left' : 'right';
        const ySteps = [70, 120, 180, 250, 300];
        ySteps.forEach((val) => {
            if (val >= minVal && val <= maxVal) {
                const y = getY(val);
                const labelX = isRTL ? w - padding.right + 5 : padding.left - 8;
                ctx.fillText(String(val), labelX, y + 4);
            }
        });

        // Draw gradient line
        if (sorted.length > 1) {
            // Gradient fill under line
            const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
            gradient.addColorStop(0, 'rgba(0, 212, 170, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 212, 170, 0)');

            ctx.beginPath();
            ctx.moveTo(getX(0), h - padding.bottom);
            sorted.forEach((_, i) => {
                ctx.lineTo(getX(i), getY(values[i]));
            });
            ctx.lineTo(getX(sorted.length - 1), h - padding.bottom);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

            // Line
            ctx.beginPath();
            sorted.forEach((_, i) => {
                if (i === 0) ctx.moveTo(getX(i), getY(values[i]));
                else {
                    // Smooth curve
                    const prevX = getX(i - 1);
                    const prevY = getY(values[i - 1]);
                    const currX = getX(i);
                    const currY = getY(values[i]);
                    const cpX = (prevX + currX) / 2;
                    ctx.bezierCurveTo(cpX, prevY, cpX, currY, currX, currY);
                }
            });
            ctx.strokeStyle = '#00d4aa';
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // Draw data points
        sorted.forEach((reading, i) => {
            const x = getX(i);
            const y = getY(reading.value);
            const isInRange =
                reading.value >= GLUCOSE_THRESHOLDS.normalMin &&
                reading.value <= GLUCOSE_THRESHOLDS.normalMax;

            // Outer glow
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = isInRange
                ? 'rgba(0, 212, 170, 0.2)'
                : 'rgba(239, 68, 68, 0.2)';
            ctx.fill();

            // Inner dot
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = isInRange ? '#00d4aa' : '#ef4444';
            ctx.fill();
        });
    }, [readings, height, t, isRTL]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: `${height}px`,
                borderRadius: '12px',
            }}
        />
    );
}
