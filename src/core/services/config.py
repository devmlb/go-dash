from io import TextIOWrapper
import os
import json
from typing import Any


class InvalidKeyException(Exception):
    __invalid_key: str

    def __init__(self, invalid_key: str, *args) -> None:
        super().__init__(*args)
        self.__invalid_key = invalid_key

    def get_invalid_key(self) -> str:
        return self.__invalid_key


class Config_Service:
    __config_path: str
    __config_file: TextIOWrapper
    __config_data: dict

    def __init__(self, data_dir: str) -> None:
        if not os.path.exists(data_dir):
            raise Exception("The data folder does not exist in the filesystem")

        self.__config_path = os.path.join(data_dir, "config.json")

        need_init = not os.path.exists(self.__config_path)
        self.__config_file = open(self.__config_path, "w+", encoding="utf8")

        if need_init:
            self.__write_defaults()
        else:
            self.__read_from_disk()

    def __del__(self) -> None:
        self.__config_file.close()

    def __write_defaults(self) -> None:
        self.__config_data = {}
        self.__config_data["organs"] = [
            {
                "name": "My amazing organ",
                "country": "France",
                "builder": "Me",
                "date": 2026,
                "web": "https://github.com/devmlb/go-dash",
                "cover": "C:\\Users\\me\\mycover.jpg",
                "preview": "C:\\Users\\me\\mypreview.jpg",
                "path": "C:\\Users\\me\\myorgan.orgue",
            }
        ]
        self.__write_to_disk()

    def __write_to_disk(self) -> None:
        self.__config_file.seek(0)
        self.__config_file.write(json.dumps(self.__config_data))

    def __read_from_disk(self) -> dict:
        self.__config_file.seek(0)
        self.__config_data = json.loads(self.__config_file.read())

    def get_all(self) -> dict:
        return self.__config_data

    def get(self, key: str) -> Any:
        try:
            return self.__config_data[key]
        except KeyError:
            raise InvalidKeyException(key)
        # Do not catch other error types, let it propagate

    def set(self, key: str, value: Any) -> None:
        self.__config_data[key] = value
        self.__write_to_disk()

    def get_path(self) -> str:
        return self.__config_path
