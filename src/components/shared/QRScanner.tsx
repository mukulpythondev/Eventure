import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs'; // For authenticated user's data
import dynamic from 'next/dynamic';
import { attendanceAction } from '@/lib/actions/events.action';

// Dynamically import the QR Code Scanner to avoid SSR issues
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

const QrScanner: React.FC = () => {
  const { user } = useUser(); // Clerk authenticated user
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // State to store successfully marked attendance records
  const [scannedRecords, setScannedRecords] = useState<{ eventId: string; clerkId: string }[]>([]);

  const handleScan = async (data: string | null) => {
    if (!data) return; // Do nothing if no data is scanned

    try {
      // Decode the QR code data
      const { eventId, clerkId } = JSON.parse(data);

      // Check if the attendance is already marked in the local state
      const isAlreadyScanned = scannedRecords.some(
        (record) => record.eventId === eventId && record.clerkId === clerkId
      );

      if (isAlreadyScanned) {
        setError("You have already marked your attendance for this event.");
        return;
      }

      setError(null);
      setLoading(true);

      // Call the attendanceAction API
      const response = await attendanceAction(eventId, clerkId);

      // On success, update local state and show success message
      setScannedRecords((prev) => [...prev, { eventId, clerkId }]);
      console.log(scannedRecords)
      setScanResult(`${user?.fullName || "User"}'s attendance marked successfully!`);
    } catch (err: any) {
      // Handle API errors
      if (err.status === 404) {
        setError("Event or user not found.");
      } else if (err.status === 403) {
        setError("Event hosts cannot mark attendance for their own event.");
      } else if (err.status === 409) {
        setError("You have already marked your attendance for this event.");
      } else if (err.status === 500) {
        setError("An unexpected error occurred. Please try again.");
      } else {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scanner Error:', err);
    setError('Failed to scan QR code. Please try again.');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-cyan-500">Scan QR Code</h2>
        <p className="text-gray-300 text-center mt-2">
          Scan your event QR code to mark attendance.
        </p>

        <div className="mt-6">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-2 bg-gray-700">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {loading && (
          <p className="mt-4 text-yellow-400 text-center font-medium">Processing attendance...</p>
        )}
        {scanResult && (
          <p className="mt-4 text-green-400 text-center font-medium">{scanResult}</p>
        )}
        {error && (
          <p className="mt-4 text-red-400 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
