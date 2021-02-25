$(function () {
    const layer = layui.layer
    const form = layui.form
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const html = template('tpl-cate', res)
                $('[name=cate_id]').html(html)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击封面
    $('#btnChooseImage').click(function () {
        $('#coverFile').click()
    })

    $('#coverFile').change(function () {
        let files = this.files
        if (!files.length) {
            return
        }
        const newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let art_state = '已发布'

    $('#btnSave2').click(function () {
        art_state = '草稿'
    })

    $('#form_pub').submit(function (e) {
        // 1.阻止默认行为
        e.preventDefault()
        // 2.基于form表单，快速创建一个FormData对象
        const fd = new FormData(this)
        // 3.将发布状态添加到对象里
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publish(fd)
            })
    })

    function publish(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                location.href = '/article/art_list.html'
            }
        })
    }
})