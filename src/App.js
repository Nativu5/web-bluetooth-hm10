import React from "react";
import {
  AppBar,
  Box,
  Chip,
  Toolbar,
  Typography,
  IconButton,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import {
  Bluetooth,
  ArrowCircleUp,
  ArrowCircleDown,
  StopCircle,
  RotateLeftTwoTone,
  RotateRightTwoTone,
  Stop,
} from "@mui/icons-material";

import { ConnectBLE } from "./BLE";
import { MsgBar } from "./AlertMsg";

import "./App.css";

const OptStop = 0x00;
const OptUp = 0x01;
const OptDown = 0x02;
const OptStopRotate = 0x10;
const OptRotateLeft = 0x11;
const OptRotateRight = 0x12;

function App() {
  const [isSupported, setIsSupported] = React.useState(true);
  const [BLEstatus, SetBLEstatus] = React.useState({ connected: false });
  const [msg, setMsg] = React.useState(null);

  React.useEffect(() => {
    navigator.bluetooth.getAvailability()
      ? setIsSupported(true)
      : setIsSupported(false);
  }, []);

  const emitMsg = (severity, text) => {
    setMsg({
      severity: severity,
      text: text,
      key: Math.floor(Math.random() * 100),
    });
  };

  const handleDisconnect = () => {
    SetBLEstatus({ connected: false });
    emitMsg("warning", "蓝牙设备已断开连接！");
  };

  const handleConnect = (device, server, service, characteristic) => {
    SetBLEstatus({
      connected: true,
      device: device,
      server: server,
      service: service,
      characteristic: characteristic,
    });
    emitMsg("success", "蓝牙设备已连接！");
  };

  const handleBLEError = (e) => {
    SetBLEstatus({ connected: false });
    emitMsg("error", e.toString());
  };

  const WriteToBLE = async (code) => {
    if (!BLEstatus || !BLEstatus.connected) {
      emitMsg("error", "蓝牙设备尚未连接！");
      return;
    }

    try {
      const data = new Uint8Array([code]);
      await BLEstatus.characteristic.writeValueWithoutResponse(data);
    } catch (e) {
      emitMsg("error", e.toString());
    }
  };

  const handleClickStop = async () => {
    await WriteToBLE(OptStop);
  };

  const handleClickUp = async () => {
    await WriteToBLE(OptUp);
  };

  const handleClickDown = async () => {
    await WriteToBLE(OptDown);
  };

  const handleClickStopRotate = async () => {
    await WriteToBLE(OptStopRotate);
  };

  const handleClickRotateLeft = async () => {
    await WriteToBLE(OptRotateLeft);
  };

  const handleClickRotateRight = async () => {
    await WriteToBLE(OptRotateRight);
  };

  return (
    <>
      {!isSupported ? (
        <Dialog open={!isSupported}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              It seems that your browser does not support Web Bluetooth.
              <br />
              Sorry for the inconvenience.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      ) : null}
      <AppBar position="static">
        <Toolbar>
          <Bluetooth />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            智能百叶窗控制器
          </Typography>
          <ConnectBLE
            onConnected={handleConnect}
            onDisconnected={handleDisconnect}
            onError={handleBLEError}
          />
        </Toolbar>
      </AppBar>
      <Box className="mainbox">
        <Chip
          className="connect_status"
          icon={<Bluetooth />}
          label={BLEstatus.connected ? "Connected" : "Unconnected"}
          color={BLEstatus.connected ? "primary" : "default"}
          variant={"outlined"}
        />
        
        <ButtonGroup className="buttons_control" orientation="vertical">
          <IconButton
            className="button_array_up"
            size="large"
            onClick={handleClickUp}
          >
            <ArrowCircleUp sx={{ fontSize: 80, paddingBottom: 0 }} />
          </IconButton>
          <IconButton
            className="button_stop"
            size="large"
            onClick={handleClickStop}
          >
            <StopCircle sx={{ fontSize: 80, padding: 0 }} />
          </IconButton>
          <IconButton
            className="button_array_down"
            size="large"
            onClick={handleClickDown}
          >
            <ArrowCircleDown sx={{ fontSize: 80, paddingTop: 0 }} />
          </IconButton>
        </ButtonGroup>
        <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
          位置控制
        </Typography>

        <ButtonGroup
          className="buttons_leaf_control"
          color="primary"
          orientation="horizontal"
        >
          <IconButton
            className="button_rotate_left"
            size="large"
            onClick={handleClickRotateLeft}
          >
            <RotateLeftTwoTone sx={{ fontSize: 40 }} />
          </IconButton>
          <IconButton
            className="button_rotate_stop"
            size="large"
            onClick={handleClickStopRotate}
          >
            <Stop sx={{ fontSize: 40 }} />
          </IconButton>
          <IconButton
            className="button_rotate_right"
            size="large"
            onClick={handleClickRotateRight}
          >
            <RotateRightTwoTone sx={{ fontSize: 40 }} />
          </IconButton>
        </ButtonGroup>
        <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
          扇叶控制
        </Typography>
        
      </Box>
      {msg ? (
        <MsgBar severity={msg.severity} text={msg.text} key={msg.key} />
      ) : null}
    </>
  );
}

export default App;
