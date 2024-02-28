import { GUI } from 'dat.gui';

let gui = new GUI();
let debugObject = {};

const createGUI = () => {
  if (gui) return gui;
  gui = new GUI();
  return gui;
};

const clearGUI = () => {
  gui.destroy();
  gui = null;
  debugObject = {};
};

export { createGUI, gui, debugObject, clearGUI };
