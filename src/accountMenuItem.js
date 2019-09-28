'use-strict';

const Gio = imports.gi.Gio;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const NirahSocket = Me.imports.src.socket;

let sock;

var AccountMenuItem = class accountMenuItem extends PopupMenu.PopupMenuItem {
  constructor(dex, account) {
    super(calculateLabel(dex, account));
    this._acc = account;
    this._id = dex;
    this.connect('activate', this.connect);
  }

  connect() {
    sock = new NirahSocket.NirahSocket();
    sock.connect();
    sock.send_message({ method: "InitializeAccount", id: this._id });
  }
};

function calculateLabel(dex, account) {
  return account["host"];
}
