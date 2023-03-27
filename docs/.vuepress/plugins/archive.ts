
const archiveRouterPlugin = (options) => {
    return (app) => {
        return {
            name: 'archive-router-plugin',

            onInitialized: (app): Promise<void> => {
                // 创建，content -> new page
                return Promise.resolve()
            },
        }
    }
}