"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { recordAttendanceScan } from "@/lib/scanAttendance";
const SCANNER_ELEMENT_ID = "qr-reader";
export function useQrScanner() {
    const scannerRef = useRef(null);
    const isLockedRef = useRef(false);
    const [result, setResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const stopScanner = useCallback(async () => {
        if (!scannerRef.current) return;
        try {
            const state = scannerRef.current.getState();
            if (state === 2 || state === 3) {
                await scannerRef.current.stop();
            }
            await scannerRef.current.clear();
        } catch (err) {
            console.warn("Scanner cleanup:", err.message);
        }
        scannerRef.current = null;
    }, []);
    const handleDecode = useCallback(async (decodedText) => {
        if (isLockedRef.current) return;
        isLockedRef.current = true;
        setIsProcessing(true);
        const outcome = await recordAttendanceScan(decodedText);
        setIsProcessing(false);
        setResult(
            outcome.success
                ? { type: "success", ...outcome.data }
                : { type: "error", reason: outcome.reason },
        );
    }, []);

    const recordManualId = useCallback(async (studentId) => {
        if (isLockedRef.current) return;
        isLockedRef.current = true;
        setIsProcessing(true);
        const outcome = await recordAttendanceScan(studentId);
        setIsProcessing(false);
        setResult(
            outcome.success
                ? { type: "success", ...outcome.data }
                : { type: "error", reason: outcome.reason },
        );
    }, []);
    useEffect(() => {
        if (scannerRef.current) return;
        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;
        scanner
            .start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => handleDecode(decodedText),
                () => { },
            )
            .catch(console.error);
        return () => {
            stopScanner();
        };
    }, []);
    const handleScanNext = useCallback(() => {
        setResult(null);
        isLockedRef.current = false;
    }, []);
    return {
        elementId: SCANNER_ELEMENT_ID,
        result,
        isProcessing,
        handleScanNext,
        recordManualId,
        stopScanner,
    };
}