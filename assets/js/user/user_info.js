$(function () {
    const { form, layer } = layui
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称最多不能超过六位数'
            }
        }
    })

    initUserInfo()
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val('userInfo', res.data)
            }
        })
    }

    // 重置按钮绑定事件
    $('#butReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })

    // 绑定提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                window.parent.getUser()
            }
        })
    })
})