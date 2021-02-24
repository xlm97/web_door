$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#chooseImg').on('click', function () {
        $('#file').click()
    })

    $('#file').change(function () {
        const filelist = this.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片')
        }
        const file = filelist[0]
        const imgUrl = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $('#upload').click(function () {
        const dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败')
                }
                layer.msg('更新头像成功')
                window.parent.getUser()
            }
        })
    })
})