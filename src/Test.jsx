import React, { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import debianLogo from "./assets/debian.svg";
import debPkg from "./assets/debpkg.svg";
// import { Card, CardBody } from "@nextui-org/react";
// import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Accordion, AccordionItem, Image } from "@nextui-org/react";
function App() {

    const [logs, setLogs] = useState([]);
    const [packagePath, setPackagePath] = useState('');
    const [packageName, setPackageName] = useState('pkgname');
    const [packageVersion, setPackageVersion] = useState('pkgversion');
    const [packageDescription, setPackageDescription] = useState(
        '这是默认的配置说明,尚未知晓到底有多少可以使用,姑且先写很多,啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦'
    );




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
        // <div className="container mx-auto flex h-screen justify-center items-center">
        <div className="container mx-auto flex h-screen justify-center items-center">
            {/* <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4"> */}
            <div class="p-2 max-w-lg mx-auto bg-white flex flex-col items-center space-x-4">
                <div class="flex flex-row items-stretch gap-4 p-2">
                    <div class="flex-shrink-0 self-center">
                        <img class="h-14 w-14 " src={debPkg} alt="debPkg Logo" />
                    </div>
                    <div class=" flex-shrink self-end">
                        <div class=" text-xl font-medium text-black">{packageName}</div>
                        <p class="text-gray-500">{packageVersion}</p>
                    </div>
                </div>
                <div class="flex-grow flex-shrink p-2  rounded-lg shadow-md h-14 overflow-auto">
                    <p class="text-xs text-center leading-4 break-words text-gray-700 ">{packageDescription}</p>
                </div>
                <div class="p-2 items-stretch">
                    <button class=" bg-white border border-white hover:border-red-500  text-gray-800 shadow-lg text-md px-2 rounded-md transition duration-300 ease-in-out">
                        Install
                    </button>
                    {/* <button class="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                        Button
                    </button>
                    <button class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out">
                        Button
                    </button> */}
                </div>
            </div>




            {/* <Card className="">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="Debian logo"
                        height={60}
                        radius="sm"
                        src={debianLogo}
                        width={60}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">DEB</p>

                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div>
                        <button onClick={handleFileSelect}>Select Package</button>
                        <input
                            type="text"
                            value={packagePath}
                            onChange={(e) => setPackagePath(e.target.value)}
                            placeholder="Enter package path"
                        />
                        <button onClick={handleInstallClick}>Install Package</button>

                    </div>
                </CardBody>
                <Divider />
                <CardFooter>
                    <div>
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </CardFooter>
            </Card> */}
        </div>









    );
}

export default App;
