import { Platform, Alert } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function requestBluetoothPermissions(): Promise<boolean> {
  switch (Platform.OS) {
    case 'android':
      const locationPermission = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (
        locationPermission == RESULTS.DENIED ||
        locationPermission == RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Required Permissions Missing',
          'Location permission is required.'
        );

        return false;
      }

      const scanPermission = await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);

      if (
        scanPermission == RESULTS.DENIED ||
        scanPermission == RESULTS.BLOCKED
      ) {
        Alert.alert(
          'Required Permissions Missing',
          'Bluetooth scan permission is required.'
        );

        return false;
      }

      break;

    case 'ios':
      const bluetoothPermission = await request(PERMISSIONS.IOS.BLUETOOTH);

      if (bluetoothPermission !== RESULTS.GRANTED) {
        Alert.alert(
          'Required Permissions Missing',
          'Bluetooth permission is required.'
        );

        return false;
      }

      break;
  }

  return true;
}
