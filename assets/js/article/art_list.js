$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(data)
        let y = fn(dt.getFullYear())
        let m = fn(dt.getMonth() + 1)
        let d = fn(dt.getDate())

        let h = fn(d.getHours())
        let mm = fn(d.getMinutes())
        let s = fn(d.getSeconds())
        return `${y}-${m}-${d} ${h}:${mm}:${s}`
    }

    // 补0函数
    function fn(num) {
        return num > 9 ? num : '0' + num
    }

    // 请求数据
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let html = template('tpl-table', res)
                $('tbody').html(html)
                renderPage(res.total)
            }
        })
    }

    let form = layui.form
    // 渲染选项
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                let html = template('tpl-cate', res)
                $('[name=cate_id]').html(html)
                form.render()
            }
        })
    }

    // 查询
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    const laypage = layui.laypage
    // 渲染分页
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的Id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,5,10],
            // 分页发生切换的时候触发jump回调
            jump:function (obj,first) {
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除
    $('tbody').on('click','.btn-delete', function(){
        const len = $('.btn-delete').length
        const id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url:'/my/article/delete/' + id,
                success(res){
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    if (len === 1&&q.pagenum!==1) {
                        q.pagenum--
                    }
                    layer.msg('删除文章成功')
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})