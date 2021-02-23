$(function () {
    // 点击注册
    $('#link-login').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击登录
    $('#link-reg').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 校验规则
    const form = layui.form
    form.verify({
        // 设置了名为pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码不规范，必须6到12位，且不能有空格'],
        // 设置确认密码的校验规则
        repwd: function (value) {
            // 获取密码框的输入值
            const pwd = $('.reg-box [name=password]').val()
            // 判断确认密码的输入值与密码框的输入值是否相同
            if (pwd !== value) return '两次输入不一致'
        }
    })

    // 注册
    $('#form_red').on('submit', function (e) {
        // 阻止提交的默认行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                // 获取用户框和密码框的输入值
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success(res) {
                // 判断是否注册成功
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功，请登录')
                $('#link-reg').click()
            }
        })
    })

    // 登录
    $('#login_form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) return layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})