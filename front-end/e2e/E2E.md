# E2E Testing Guide

This project uses **Detox** for end-to-end (E2E) testing on iOS simulators. Detox is specifically designed for React Native applications and provides reliable, automated testing for mobile apps.

## Prerequisites

Before running the E2E tests, make sure you have:

1. **Xcode** installed (for iOS simulator)
2. **Node.js** and **npm** installed
3. **Detox CLI** installed globally:
   ```bash
   npm install -g detox-cli
   ```
4. All project dependencies installed:
   ```bash
   npm install
   ```

## Running the Tests

### First Time Setup

1. **Build the app for testing** (only needed once, or after code changes):
   ```bash
   npm run test:e2e:ios:build
   ```

   This will create a Release build of the app optimized for testing.

### Running Tests

To run the complete E2E test suite:

```bash
npm run test:e2e:ios
```

This command will:
1. **Reset the iOS simulator** - Clears all data and ensures a clean state
2. **Install the app** fresh on the simulator
3. **Run all E2E tests** - Currently includes the full user flow test

**Note:** The simulator reset ensures consistent test results by clearing all previous data, including login credentials and onboarding state.

## What Gets Tested

### Current Test: `onboarding-login-navigation.test.js`

This test covers the complete critical user journey through the app:

1. **Onboarding Flow**
   - Displays the 3 first-time information screens
   - Navigates through each screen using the next button
   - Verifies the onboarding experience works correctly

2. **Authentication**
   - Logs in with test credentials:
     - Username: `margaret`
     - Password: `margaret123`
   - Verifies successful login and navigation to home screen

3. **Navigation Through All Tabs**
   - **Home/Overview** - Verifies user greeting is displayed
   - **Diagnose** - Checks diagnosis history page loads
   - **My Garden** - Confirms garden page is accessible
   - **Profile** - Validates profile page displays correctly
   - **Return to Home** - Ensures navigation back to home works

**Total test duration:** ~55 seconds

## Test Configuration

### Simulator Settings
- **Device:** iPhone 17 Pro
- **Configuration:** Release build (ios.sim.release)
- **Simulator state:** Completely reset before each test run

### Test Settings
- **Timeout:** 240 seconds (4 minutes) for the entire test suite
- **Synchronization:** Disabled (manual waits used instead)
- **Permissions:** Automatically granted (notifications, location, camera)

## Understanding Test Output

When you run the tests, you'll see detailed console output showing:

```
✅ Navigating through onboarding...
✅ Found login screen!
🔐 Signing in with margaret/margaret123...
✅ Login successful! Starting navigation through tabs...
📍 Tab 1: Home/Overview
✓ Verified: On Home page
📍 Tab 2: Navigating to Diagnose tab...
✓ Verified: On Diagnose page
📍 Tab 3: Navigating to My Garden tab...
✓ Verified: On My Garden page
📍 Tab 4: Navigating to Profile tab...
✓ On Profile page
📍 Returning to Home tab...
✓ Verified: Back on Home page
✅ E2E test completed! Successfully navigated through all tabs.
```

### Test Results

- **PASS** - All tests passed successfully ✅
- **FAIL** - One or more tests failed ❌ (check error details in output)

## Troubleshooting

### Common Issues

**1. "Cannot find simulator"**
- Make sure Xcode is installed
- Open Xcode and install iOS simulators
- Check simulator name in `.detoxrc.js` matches available simulators

**2. "App binary not found"**
- Run `npm run test:e2e:ios:build` to build the app first
- Check that the build succeeded without errors

**3. "Test timeout"**
- The simulator might be slow on your machine
- Try increasing timeouts in `e2e/jest.config.js` (testTimeout)

**4. "Element not found"**
- The app UI might have changed
- Check that element IDs and text in the test still match the app
- Rebuild the app with latest changes: `npm run test:e2e:ios:build`

**5. Simulator is stuck or frozen**
- Stop the test (Ctrl+C)
- Close the simulator manually
- Run the tests again - the reset script will handle it

## Modifying Tests

### Adding Test IDs to Components

To make elements testable, add `testID` props to your React Native components:

```tsx
<TextInput testID="username-input" />
<TouchableOpacity testID="login-button">
  <Text>Login</Text>
</TouchableOpacity>
```

### Writing New Tests

Create new test files in the `e2e/` directory with the pattern `*.test.js`:

```javascript
describe('My New Test', () => {
  it('should do something', async () => {
    await device.launchApp();
    await element(by.id('my-button')).tap();
    await expect(element(by.text('Success!'))).toBeVisible();
  });
});
```

## Important Notes

⚠️ **Always rebuild after code changes:**
```bash
npm run test:e2e:ios:build
```

⚠️ **Simulator must be iPhone 17 Pro** - If you want to use a different device, update `.detoxrc.js`

⚠️ **Tests reset all data** - The simulator is completely erased before each test run to ensure consistency

✅ **Tests run in release mode** - This is faster and more stable than debug mode

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Detox API Reference](https://wix.github.io/Detox/docs/api/actions)
- [Jest Matchers](https://wix.github.io/Detox/docs/api/matchers)

## Questions?

If you run into issues or have questions about the E2E tests, reach out to the team!
