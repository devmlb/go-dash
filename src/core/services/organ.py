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
            self.organs[i]["id"] = f"""{self.organs[i]["name"]}-{self.organs[i]["creator"]}-{self.organs[i]["date"]}"""

    def get_all(self) -> list:
        sanitized_organs = []
        for organ in self.organs:
            sanitized_organs.append({
                "id": organ["id"],
                "name": organ["name"],
                "creator": organ["creator"],
                "date": organ["date"]
            })

        return sanitized_organs
    
    def get(self, id: str) -> dict:
        for organ in self.organs:
            if organ["id"] == id:
                return organ
            
        raise Exception("Cannot find argon with id " + id)

    def open(self, id: str) -> None:
        self.storage_service.open_file(self.get(id)["path"])

    def get_cover_b64(self, id: str) -> str:
        return self.storage_service.get_image_b64(self.get(id)["cover"])

    def get_preview_b64(self, id: str) -> str:
        return self.storage_service.get_image_b64(self.get(id)["preview"])