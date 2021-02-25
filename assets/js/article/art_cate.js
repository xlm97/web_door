$(function () {
    let index = null
    initCateInfo()

    // 添加的点击事件
    $('#btnAddCate').click(function () {
        index = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加类别',
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initCateInfo()
                layer.msg(res.message)
                layer.close(index)
            }
        })
    })

    let indexEdit = null
    let form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改类别',
            content: $('#dialog-edit').html()
        })

        const id = $(this).data('id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改内容
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 关闭弹出层
                layer.close(indexEdit)
                // 初始化页面信息
                initCateInfo()
            }
        })
    })

    // 删除内容
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 关闭弹出层
                    layer.close(index)
                    // 初始化页面信息
                    initCateInfo()
                }
            })
        })
    })
})

function initCateInfo() {
    $.ajax({
        type: "GET",
        url: '/my/article/cates',
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            const html = template('tpl-table', res)
            $('tbody').html(html)
        }
    })
}

