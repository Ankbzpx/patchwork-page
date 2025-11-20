import os
from glob import glob
import base64
from icecream import ic

with open("models.js", "w") as js_file:
    js_file.writelines("let models = {};\n")

    glb_list = glob("**/**/*.glb")
    for glb_path in glb_list:
        splits = glb_path.split("/")
        splits = [split.replace(".glb", "") for split in splits]

        with open(glb_path, "rb") as f:
            glb_bytes = f.read()
            glb_base64 = base64.b64encode(glb_bytes).decode("utf-8")

        tag = "_".join(splits)
        data_url = "data:;base64," + glb_base64

        js_file.writelines(f'models["{tag}"] = "{data_url}";\n')

    js_file.writelines("export default models;\n")
