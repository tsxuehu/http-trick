export default interface IWorkbenchService {
    start(query: Record<string, string>): Promise<void>
}
