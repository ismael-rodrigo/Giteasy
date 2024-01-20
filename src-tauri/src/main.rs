// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]
  
use std::process::{Command, Output};
use std::env;
use serde::Serialize;
use tauri::{SystemTray,  CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent, Manager};
use tauri_plugin_positioner:: { Position, WindowExt};
use window_vibrancy::apply_acrylic ;
use window_shadows::set_shadow;
// import Color
#[tauri::command]
fn get_current_branch(path: &str) -> Result<String, ()> {
    let mut git = Command::new("git");
    let result = git.arg("-C").arg(path).arg("branch")
        .arg("--show-current").output().expect("failed to execute process");

    Ok(String::from_utf8(result.stdout).unwrap())
}


#[tauri::command]
fn greet(path: &str) -> Result<String, ()>{
    let mut git = Command::new("git");
    let result = git.arg("-C").arg(path).arg("branch")
    .arg("-a").output().expect("failed to execute process");

    Ok(String::from_utf8(result.stdout).unwrap())
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
    .add_item(quit)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(hide);
    let tray = SystemTray::new().with_menu(tray_menu);


    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .on_system_tray_event( |app , event: SystemTrayEvent| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick { position: _ , size: _ , ..} => {
                    let window = app.get_window("main").unwrap();
                    let _ = window.move_window(Position::TrayCenter).unwrap();
                    apply_acrylic(&window, Some((0, 0, 0, 0))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");
                    set_shadow(&window, true).expect("Unsupported platform! 'set_shadow' is only supported on Windows");
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }   
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![greet, get_current_branch])
        .system_tray(tray)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
