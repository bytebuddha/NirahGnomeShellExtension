/*
	In this example we will create a menu with several options available
*/

/* Import St because is the library that allow you to create UI elements */
const St = imports.gi.St;


/* Import Clutter because is the library that allow you to layout UI elements */
const Clutter = imports.gi.Clutter;

/*
Import Main because is the instance of the class that have all the UI elements
and we have to add to the Main instance our UI elements
*/
const Main = imports.ui.main;

/*
Import PanelMenu and PopupMenu
See more info about these objects in REFERENCE.md
*/
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

/*
Import Lang because we will write code in a Object Oriented Manner
*/
const Lang = imports.lang;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const NirahSocket = Me.imports.src.socket;
const AccountMenuItem = Me.imports.src.accountMenuItem.AccountMenuItem;

let message;
let menuitem;
let account_id;

const NirahMenuItem = new Lang.Class({
	Name: 'PopupMenuExample',	// Class Name
	Extends: PanelMenu.Button,	// Parent Class

	// Constructor
	_init: function() {
		this.parent(1, 'PopupMenuExample', false);
		const gicon = Gio.icon_new_for_string(Me.path + "/icon.svg");
    const nirahIcon = new St.Icon({ gicon: gicon, icon_size: "24" });
    this.hbox = new St.BoxLayout({ style_class: "panel-status-menu-box" });
		this.hbox.add_child(nirahIcon);
		this._sock = new NirahSocket.NirahSocket();
		if(this._sock.connect()) {
			this._sock.send_message({ method: "AccountsList" });
			message = this._sock.read_message();
			log(JSON.stringify(message));
			if(message.response === "AccountList") {
				for(account_id = 0;account_id < message["accs"].length; account_id++) {
					log(JSON.stringify(message["accs"][account_id]));
					this.menu.addMenuItem(new AccountMenuItem(account_id, message["accs"][account_id]));
				}
			} else {
				log("Invalid response: "+JSON.stringify(message));
			}
		} else {
			menuitem = new PopupMenu.PopupMenuItem('Unable to connect to thie nirah daemon.');
			this.menu.addMenuItem(menuitem);
		}
    this.actor.add_child(this.hbox);
	},

	destroy: function() {

		this.parent();
	}
});

let button;

function init() {}

function enable() {
	button = new NirahMenuItem;

	Main.panel.addToStatusArea('NirahMenuItem', button, 0, 'right');
}

function disable() {

	button.destroy();
}
