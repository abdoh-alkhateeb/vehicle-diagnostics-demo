# Vehicle Diagnostics Demo

This repository contains a simple mobile application for vehicle diagnostics. Follow the steps below to set up and run both the backend and frontend.

**Note:** This application was only tested on Android due to limited time and the simplicity of the use case. Therefore, instructions are only provided for Android.

## Backend Setup

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```sh
   python server.py
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Log in to EAS (Expo Application Services):
   ```sh
   eas login
   ```
4. Update the `app.json` file to set `API_URL` to the local IP address of the PC hosting the backend before building the app.
5. Build the application for Android:
   ```sh
   eas build --profile development --platform android
   ```
6. Install the resultant APK, connect your Android device using USB, and enable USB debugging (install ADB if required).
7. Start the development server:
   ```sh
   npx expo start --dev-client
   ```
8. Press `a` in the Expo CLI to launch the app automatically on your device.

## Testing the App

Once the frontend and backend are running, you can interact with the app to test its features.

Enjoy using the Vehicle Diagnostics Demo!
