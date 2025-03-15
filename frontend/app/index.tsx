import axios from 'axios';
import Constants from 'expo-constants';
import { BleManager } from 'react-native-ble-plx';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { requestBluetoothPermissions } from '@/utils/permissionsHelper';

const MOCK_DIAGNOSTICS = {
  vehicle_id: 'ABC-123',
  timestamp: '2025-03-15T12:30:00Z',
  engine: {
    rpm: 600,
    temperature: 85,
  },
  battery: {
    voltage: 12.5,
  },
  fuel: {
    level: 50,
  },
};

export default function Index() {
  const managerRef = useRef(new BleManager());
  const [status, setStatus] = useState('Not Connected');
  const [showDeviceNames, setShowDeviceNames] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deviceNames, setDeviceNames] = useState<Set<string>>(new Set());
  const [report, setReport] = useState('');

  useEffect(() => {
    const generateReport = async () => {
      if (status === 'Connected') {
        try {
          setReport('Generating report...');

          const response = await axios.post(
            Constants.expoConfig?.extra?.API_URL,
            MOCK_DIAGNOSTICS
          );

          setReport(JSON.stringify(response.data, null, 2));
        } catch (error) {
          setReport('Failed to generate report :(');
        }
      }
    };

    generateReport();
  }, [status]);

  const scanForDevices = async () => {
    const hasPermissions = await requestBluetoothPermissions();

    if (!hasPermissions) return;

    setShowDeviceNames(true);
    setDeviceNames(new Set(['MOCK DEVICE 1', 'MOCK DEVICE 2']));

    managerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setErrorMessage(error.toString().split(':')[1]);
        return;
      }

      setErrorMessage('');

      if (device && device.name) {
        setDeviceNames(
          (prevDeviceNames) =>
            new Set([...prevDeviceNames, device.name as string])
        );
      }
    });

    setTimeout(() => managerRef.current.stopDeviceScan(), 5000);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 24, padding: 20, color: 'darkblue' }}>
        Vehicle Diagnostics
      </Text>
      <Text>Status: {status}</Text>

      <TouchableOpacity
        style={{ backgroundColor: 'darkblue', padding: 10, margin: 20 }}
        onPress={() => scanForDevices()}
      >
        <Text style={{ color: 'white' }}>Scan for Devices</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text>Error: {errorMessage}</Text>
      ) : (
        showDeviceNames && (
          <>
            <Text>Devices:</Text>
            <FlatList
              data={Array.from(deviceNames)}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setStatus('Connected')}
                  disabled={status === 'Connected'}
                >
                  <Text
                    style={{ fontSize: 18, padding: 10, color: 'darkblue' }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )
      )}

      <Text style={{ fontWeight: 'bold', margin: 20 }}>Report: {report}</Text>
    </View>
  );
}
