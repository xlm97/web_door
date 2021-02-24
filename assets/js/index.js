$(function () {
    // 获取用户信息及其权限
    getUser()

    // 退出按钮
    $('#btnout').click(function () {
        // 设置询问退出框
        layer.confirm('确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 删除缓存的token信息
            localStorage.removeItem('token')
            // 返回到登录界面
            location.href = '/login.html'
            layer.close(index);
        });
    })
})

function getUser() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success(res) {
            if (res.status !== 0) return layer.msg('res.message')
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    const username = user.nickname || user.username
    $('#welcome').html('欢迎' + username)
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        const firstName = username[0].toUpperCase()
        $('.text-avatar').html(firstName).show()
    }
}