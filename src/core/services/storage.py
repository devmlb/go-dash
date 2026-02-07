import os
import json
import re
import base64


class Storage_Service:
    config_path: str

    def __init__(self, data_dir: str) -> None:
        if not os.path.exists(data_dir):
            raise Exception("The data folder does not exist in the filesystem")

        self.config_path = os.path.join(data_dir, "config.json")

        if not os.path.exists(self.config_path):
            with open(self.config_path, "w", encoding="utf8") as config_file:
                config_file.write(json.dumps({"organs": []}, indent=2))

    def get_config(self) -> dict:
        with open(self.config_path, "r", encoding="utf8") as config_file:
            config = config_file.read()

        return json.loads(config)
    
    def get_config_path(self) -> str:
        return self.config_path

    def open_file(self, path: str) -> None:
        os.startfile(path)

    def get_image_b64(self, path: str) -> str:
        if not os.path.exists(path) or not re.search(r"(png|jpg|jpeg)$", path.lower()):
            raise Exception("Cannot find an image with this path in the filesystem")

        with open(path, "rb") as image_file:
            b64_image = base64.b64encode(image_file.read())

        return b64_image
