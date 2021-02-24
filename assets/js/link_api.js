// 注意：每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，同一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 统一为有权限的接口设置名叫headers的请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.token || ''
        }

        const successFunction = options.success.bind(this)
        options.success = function (res) {
            successFunction(res)
            const { message, status } = res
            if (message === "身份认证失败！" && status === 1) {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    }
})