import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import reactLogo from "./assets/react.svg";
import debianLogo from "./assets/debian.svg";
import "./App.css";

function App() {

  const [logs, setLogs] = useState([]);
  const [packagePath, setPackagePath] = useState('');

  useEffect(() => {
    // 在组件挂载时调用 Rust 的 get_args 函数
    invoke('get_args')
      .then((args) => {
        // 处理获取到的命令行参数，这里假设第一个参数是 pkgpath
        if (args && args.length > 1) {
          // setPackagePath(args[1]);
          var packagePath = args[1];
          invoke('install_package', { packagePath })
            .catch(error => console.error(error));
        }
      })
      .catch((error) => console.error('Error fetching args:', error));

    const logUnlisten = listen('log', (event) => {
      setLogs((currentLogs) => [...currentLogs, event.payload]);
    });

    return () => {
      logUnlisten.then((fn) => fn());
    };
  }, []);

  const handleInstallClick = () => {
    invoke('install_package', { packagePath })
      .catch(error => console.error(error));
  };

  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          { name: 'Debian Package', extensions: ['deb'] }
        ]
      });

      if (selected) {
        const filePath = Array.isArray(selected) ? selected[0] : selected;
        // 调用 Tauri 后端安装包
        invoke('install_package', { packagePath: filePath })
          .catch(error => console.error(error));
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };


  return (
    <div className="container">
      <h1>Welcome to Pkg-installer!</h1>

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
          <img src={debianLogo} className="logo debian" alt="Debian logo" />
        </a>
      </div>

      {/* <p>Click on the Tauri, Vite, and React logos to learn more.</p> */}

    <div>
      <button onClick={handleFileSelect}>Select Package</button>
      <input
        type="text"
        value={packagePath}
        onChange={(e) => setPackagePath(e.target.value)}
        placeholder="Enter package path"
      />
      <button onClick={handleInstallClick}>Install Package</button>
      <div>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
      
    </div>
  );
}

export default App;
