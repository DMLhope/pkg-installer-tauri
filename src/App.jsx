import { useState } from "react";
import reactLogo from "./assets/react.svg";
import debianLogo from "./assets/debian.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [installMsg, setInstallMsg] = useState("");
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  async function installPackage() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setInstallMsg(await invoke("install_pkg", { path }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.debian.org/" target="_blank">
          <img src={debianLogo} className="logo linux" alt="Debian logo" />
        </a>
      </div>

      {/* <p>Click on the Tauri, Vite, and React logos to learn more.</p> */}

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          installPackage();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setPath(e.currentTarget.value)}
          placeholder="Enter a path to install..."
        />
        <button type="submit">安装</button>
      </form>

      <p>{installMsg}</p>
      
    </div>
  );
}

export default App;
