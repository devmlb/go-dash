from . import storage

class Organ_Service:
    organs: list
    storage_service: storage.Storage_Service

    def __init__(self, storage_service: storage.Storage_Service):
        self.storage_service = storage_service
        self.reload()

    def reload(self) -> None:
        self.organs = self.storage_service.get_config()["organs"]

        for i in range(len(self.organs)):
            self.organs[i]["id"] = f"""{self.organs[i]["name"]}-{self.organs[i]["country"]}-{self.organs[i]["date"]}"""

    def get_all(self) -> list:
        sanitized_organs = []
        for organ in self.organs:
            sanitized_organs.append({
                "id": organ["id"],
                "name": organ["name"],
                "country": organ["country"],
                "date": organ["date"]
            })

        return sanitized_organs
    
    def get(self, id: str) -> dict:
        for organ in self.organs:
            if organ["id"] == id:
                return organ
            
        raise Exception("Cannot find organ with id " + id)

    def open(self, id: str) -> None:
        try:
            self.storage_service.open_file(self.get(id)["path"])
        except:
            raise Exception(f"No path provided for organ with id '{id}'")

    def get_cover_b64(self, id: str) -> str:
        try:
            return self.storage_service.get_image_b64(self.get(id)["cover"])
        except:
            raise Exception(f"No cover provided for organ with id '{id}'")

    def get_preview_b64(self, id: str) -> str:
        try:
            return self.storage_service.get_image_b64(self.get(id)["preview"])
        except:
            raise Exception(f"No preview provided for organ with id '{id}'")