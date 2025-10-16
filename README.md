# Steam Hour Booster by fatezero94 🎮

**Effortlessly farm Steam trading cards and boost your playtime by idling multiple games at once.**

Tired of launching games one by one just to earn a few trading cards? Steam Hour Booster is the ultimate tool for power users. Log in once, select your games, and let the app simulate "in-game" status for up to **32 games simultaneously**, skyrocketing your card-farming efficiency.

![Screenshot of the main page of the booster](https://i.imgur.com/4eKfXCP.png)

## ✨ Features

*   **Mass Concurrent Idling:** Go beyond the limits. Idle up to **32 games at the same time** on a single Steam account.
*   **Smart Session Management:** The app intelligently manages your Steam sessions to ensure all selected games receive playtime, maximizing your card drops.
*   **Flexible Status Control:** Want to idle games but show your friends you're available? Select up to 31 games and set a **custom status** (like "AFK" or "Custom Message") to display on your profile.
*   **Simple & Secure Login:** Log in directly and securely using the official `steam-user` npm package. Your credentials are never stored.
*   **Clean & Intuitive Interface:** A beautiful Electron-based interface makes it easy to view your library, select games, and monitor your idling progress.
*   **Total Hour Boosting:** Accumulate hours across all your selected games, boosting your total playtime and increasing your Steam level prestige.

## 🚀 How It Works

1.  **Download & Launch:** Download the latest release for your OS (Windows, macOS) and open the application.
2.  **Secure Login:** Enter your Steam account credentials securely. (This uses the same trusted method as many Steam bots and tools).
3.  **Browse & Select:** Your Steam game library will load. Simply check the boxes for the games you want to idle (up to 32).
4.  **Optional: Set a Status:** Choose to set a custom status for your 32nd slot if you don't want to idle a 32nd game.
5.  **Start Idling!** Hit the "Start Idling" button. The app will run in the background, managing everything for you. Watch the hours roll in!

## 📦 Download & Installation

Head over to the [Releases](https://github.com/kdenckert94/steam-hour-booster/releases) page to download the latest version for your operating system.

Simply run the installer and launch the application (Mac) or unzip the archive and start the .exe (Windows).

## ❓ FAQ

### Is this safe? Will I get banned?

This application uses the same underlying technology as many popular and long-standing Steam bots (`steam-user`). It mimics a legitimate game client. While no third-party tool can ever be *100% guaranteed*, this method has been used safely by the community for years. **It does not modify Steam files or use VAC-protected game code.** Use at your own discretion.

### Why can I only idle 32 games?

This is a technical limitation of the Steam network. A single account can only report being "in-game" for a maximum of 32 titles at any given time. This app pushes that limit to the absolute maximum.

### Can I use my computer while idling?

Absolutely! The app runs as a background process. You can browse the web, work, or even play non-Steam games without interrupting the idling session.

### What happens when I get all my card drops?

The app will continue to idle the game, adding to your playtime. It's up to you to stop the session or deselect games that have no more card drops remaining.

## 🛠 For Developers

This is an open-source Electron application.

### Prerequisites
*   Node.js
*   npm

### Running from Source

```bash
# Clone the repository
git clone https://github.com/kdenckert94/steam-hour-booster.git

# Navigate into the directory
cd steam-hour-booster

# Install dependencies
npm install

# Start the application in development mode
npm run start

# To build a distributable package
npm run make
```

## ⚠️ Disclaimer

This project is not affiliated with Valve Corporation, Steam, or any of its partners. All trademarks and registered trademarks are the property of their respective owners. Use of this software is at your own risk. The developers are not responsible for any account penalties that may occur, though the risk is considered very low.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/fatezero94/steam-hour-booster/issues).

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Ready to farm? Download now and get those cards!**
