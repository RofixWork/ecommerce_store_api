class UserController {
    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
    static async all(request, response) {
        return response.send('GET ALL USERS')
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async get(request, response) {
        return response.send('GET user')
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async current(request, response) {
        return response.send('current')
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async update_user(request, response) {
        return response.send('update USER')
    }

     /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {import('express').Response}
     */
     static async update_user_password(request, response) {
        return response.send('update password')
    }
}

export default UserController;