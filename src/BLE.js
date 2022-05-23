import Button from "@mui/material/Button";

// Pre-defined service:
// 0000ffe0-0000-1000-8000-00805f9b34fb
// Pre-defined char:
// 0000ffe1-0000-1000-8000-00805f9b34fb

export const ConnectBLE = ({onConnected, onDisconnected, onError}) => {
  
  const handleClick = async () => {
    try {
      // Search for Bluetooth devices that advertise service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["0000ffe0-0000-1000-8000-00805f9b34fb"] }],
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"],
        // acceptAllDevices: true
      });

      // Add an event listener to detect when a device disconnects
      device.addEventListener("gattserverdisconnected", onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device.gatt.connect();

      // Get the service from the Bluetooth device
      const service = await server.getPrimaryService(
        "0000ffe0-0000-1000-8000-00805f9b34fb"
      );

      // Get the characteristic from the Bluetooth device
      const characteristic = await service.getCharacteristic(
        "0000ffe1-0000-1000-8000-00805f9b34fb"
      );

      onConnected(device, server, service, characteristic)

    } catch (error) {
      onError(error)
    }
  };

  return <Button color="inherit" onClick={handleClick}>连接</Button>;
};

