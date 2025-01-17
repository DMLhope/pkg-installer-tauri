// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowEvent};
use tauri::command;
use std::env;
use std::process::{Command, Stdio};
use std::io::{BufReader, BufRead};

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[command]
fn get_args() -> Vec<String> {
    std::env::args().collect()
}

// #[tauri::command]
// fn get_args()-> String{
//     let args: Vec<String> = env::args().collect();

//     if args.len() > 1 {
//         // 如果有命令行参数，假设第一个参数是 DEB 文件路径
//         let deb_path = &args[1];
        
//         // 执行 DEB 安装逻辑
//         println!("Installing package from {}", deb_path);
//         return deb_path.to_string();
//     } else {
//         return "NULL".to_string();
//     }
// }

#[tauri::command]
async fn install_package(package_path: String, window: tauri::Window) {
    let mut child = Command::new("pkexec")
        .arg("dpkg")
        .arg("-i")
        .arg(&package_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start dpkg");

    let stdout = BufReader::new(child.stdout.take().unwrap());
    let stderr = BufReader::new(child.stderr.take().unwrap());

    tauri::async_runtime::spawn(async move {
        for line in stdout.lines() {
            let line = line.expect("Could not read line from stdout");
            window.emit("log", line).expect("Failed to send log event");
        }

        for line in stderr.lines() {
            let line = line.expect("Could not read line from stderr");
            window.emit("log", line).expect("Failed to send log event");
        }

        // 等待 dpkg 命令完成
        let exit_status = child.wait().expect("Failed to wait on child");

        // 根据退出状态发送成功或失败信息
        let message = if exit_status.success() {
            "Package installation successful."
        } else {
            "Package installation failed."
        };

        window.emit("log", message.to_string()).expect("Failed to send end log event");
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_args, install_package])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



// fn main() {
    
        
//         tauri::Builder::default()
//             .invoke_handler(tauri::generate_handler![install_package])
//             .run(tauri::generate_context!())
//             .expect("error while running tauri application");
    
// }