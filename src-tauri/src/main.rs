// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn install_pkg(path: &str) -> String {
    // 替换为您想安装的软件包的路径
    let package_path = path;
    //  package_path =  "/home/dml/tmp/tmux_3.3a-5_amd64.deb";


    // 构建并执行 dpkg 命令
    let output = Command::new("pkexec")
        .arg("dpkg")
        .arg("-i")
        .arg(package_path)
        .output()
        .expect("Failed to execute command");

    // 打印命令输出
    println!("Status: {}", output.status);
    println!("Stdout: {}", String::from_utf8_lossy(&output.stdout));
    println!("Stderr: {}", String::from_utf8_lossy(&output.stderr));

    // 检查命令是否成功执行
    if output.status.success() {
        format!("Status: {} ,Package installed successfully.", String::from_utf8_lossy(&output.stdout))
    } else {
        format!("Failed to install package.")
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, install_pkg])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}