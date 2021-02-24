$(function (){
    const form = layui.form
    form.verify({
        pwd:[/^[\S]{6,12}$/,'密码不规范，应在6-12位'],
        samePwd:function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '两次密码不能相同'
            }
        },
        rePwd:function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success:(res)=>{
                if (res.status!==0) {
                    return layer.msg('修改密码失败')
                }
                layer.msg('修改密码成功')
                this.reset()
            }
        })
    })
})