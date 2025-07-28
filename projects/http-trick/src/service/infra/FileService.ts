import {Service} from "@spring4js/container-node";
import path from "path";
import fs from "fs/promises";

@Service()
export default class FileService {
    async makeDir(path: string): Promise<void> {
        await fs.mkdir(path)
    }

    async exists(path: string): Promise<boolean> {
        try {
            await fs.access(path, fs.constants.F_OK)
            return true
        } catch (err) {
            return false
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        await fs.unlink(filePath)
    };

    async readFile(path: string): Promise<string> {
        return await fs.readFile(path, {encoding: 'utf-8'})
    }

    async writeFile(path: string, content: string) {
        await fs.writeFile(path, content, {encoding: 'utf-8'});
    }

    async readJsonFromFile<T>(path: string): Promise<T> {
        const content = await fs.readFile(path, {encoding: 'utf-8'})
        return JSON.parse(content)
    }

    async writeJsonToFile<T = any>(path: string, data: T): Promise<void> {
        const content = JSON.stringify(data, null, 2);
        await fs.writeFile(path, content, {encoding: 'utf-8'});
    }

    async getJsonFileContentInDir<T = any>(dir: string): Promise<Record<string, T>> {
        const tmpFiles = await fs.readdir(dir)
        const jsonFiles = tmpFiles.filter(nameWithExtension => nameWithExtension.endsWith('.json'));
        const contentMap: Record<string, T> = {};
        for (const file of jsonFiles) {
            const fullPath = path.resolve(dir, file)
            const content = await fs.readFile(fullPath, {encoding: 'utf-8'})
            contentMap[file] = JSON.parse(content)
        }
        return contentMap;
    }
}
