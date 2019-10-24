import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('../views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('../views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('../views/dashboard/index'),
      meta: { title: '个人信息', icon: 'dashboard' }
    }]
  },

  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/teacher',
    name: '人员管理',
    meta: { title: '人员管理', icon: 'example' },
    children: [
      {
        path: 'admin',
        name: '管理员管理',
        component: () => import('../views/table/users'),
        meta: { roles: ['admin'], title: '管理员管理', icon: 'table' }
      },
      {
        path: 'grade',
        name: 'Tree',
        component: () => import('../views/table/users'),
        meta: { roles: ['admin'], title: '年级长管理', icon: 'tree' }
      },
      {
        path: 'lesson',
        name: 'Tree',
        component: () => import('../views/table/users'),
        meta: { roles: ['admin', 'grade'], title: '备课组长管理', icon: 'tree' }
      },
      {
        path: 'class',
        name: 'Tree',
        component: () => import('../views/table/users'),
        meta: { roles: ['grade'], title: '班主任管理', icon: 'tree' }
      },
      {
        path: 'teacher',
        name: 'Tree',
        component: () => import('../views/table/users'),
        meta: { roles: ['grade'], title: '任课教师管理', icon: 'tree' }
      },
      {
        path: 'students',
        name: 'Tree',
        component: () => import('../views/table/students'),
        meta: { roles: ['grade'], title: '学生管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/exam',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Exam',
        component: () => import('../views/form/exam'),
        meta: { roles: ['grade', 'class', 'teacher'], title: '考试管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/input',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Input',
        component: () => import('../views/table/input'),
        meta: { roles: ['lesson', 'class', 'teacher'], title: '成绩录入', icon: 'form' }
      }
    ]
  },

  {
    path: '/stats',
    component: Layout,
    name: 'Stats',
    meta: { title: '成绩统计', icon: 'example' },
    children: [
      {
        path: 'asClass',
        name: 'Stats',
        component: () => import('../views/table/stats'),
        meta: { roles: ['grade', 'lesson', 'class'], title: '查看各班成绩', icon: 'form' }
      },
      {
        path: 'asGrade',
        name: 'Stats',
        component: () => import('../views/table/stats_grade'),
        meta: { roles: ['grade', 'lesson'], title: '年级年绩分析', icon: 'form' }
      },
      {
        path: 'asStudent',
        name: 'Stats',
        component: () => import('../views/table/stats_stu'),
        meta: { roles: ['grade', 'lesson', 'class', 'teacher'], title: '单个学生成绩', icon: 'form' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('../views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('../views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('../views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('../views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('../views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('../views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('../views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('../views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
