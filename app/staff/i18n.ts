export type StaffLanguage = 'de' | 'en' | 'zh-CN' | 'zh-TW';

type OrderStatus = 'NEW' | 'ACCEPTED' | 'PAID' | 'CLOSED';

export type StaffCopy = {
  languageName: string;
  languageButton: string;
  languageTitle: string;
  orderId: string;
  desk: (number: number) => string;
  item: string;
  quantity: string;
  updating: string;
  status: Record<OrderStatus, string>;
  signOut: string;
  staffConsole: string;
  soundOn: string;
  enableSound: string;
  disableSound: string;
  liveRefresh: string;
  orderList: string;
  deskOverview: string;
  staffViews: string;
  noOrders: string;
  noOrdersForDesk: string;
  ordersCount: (count: number) => string;
  noOrdersForDeskLabel: (number: number) => string;
  closeDeskConfirm: (count: number, number: number) => string;
  closeDeskWarning: (number: number) => string;
  closing: string;
  closeAll: string;
  loadOrdersError: string;
  updateOrderError: string;
  closeDeskError: string;
  languageOptions: { value: StaffLanguage; label: string }[];
  closeLanguage: string;
};

const languageOptions = (labels: Record<StaffLanguage, string>) => [
  { value: 'de' as const, label: labels.de },
  { value: 'en' as const, label: labels.en },
  { value: 'zh-CN' as const, label: labels['zh-CN'] },
  { value: 'zh-TW' as const, label: labels['zh-TW'] },
];

export const staffTranslations: Record<StaffLanguage, StaffCopy> = {
  de: {
    languageName: '🇩🇪',
    languageButton: 'Sprache auswählen',
    languageTitle: 'Sprache / Language',
    orderId: 'Bestellnummer',
    desk: (number) => `Tisch ${number}`,
    item: 'Artikel',
    quantity: 'Menge',
    updating: 'WIRD AKTUALISIERT...',
    status: { NEW: 'NEU', ACCEPTED: 'ANGENOMMEN', PAID: 'BEZAHLT', CLOSED: 'GESCHLOSSEN' },
    signOut: 'Abmelden',
    staffConsole: 'Mitarbeiterbereich',
    soundOn: 'Ton an',
    enableSound: 'Ton aktivieren',
    disableSound: 'Neue-Bestellung-Ton deaktivieren',
    liveRefresh: 'Live-Aktualisierung',
    orderList: 'Bestellungen',
    deskOverview: 'Tischübersicht',
    staffViews: 'Mitarbeiteransichten',
    noOrders: 'Noch keine Bestellungen eingegangen.',
    noOrdersForDesk: 'Keine Bestellungen für diesen Tisch.',
    ordersCount: (count) => `Bestellungen: ${count}`,
    noOrdersForDeskLabel: (number) => `Tisch ${number}, keine Bestellungen`,
    closeDeskConfirm: (count, number) => `Alle ${count} offenen Bestellungen an Tisch ${number} schließen? Dies kann nicht rückgängig gemacht werden.`,
    closeDeskWarning: (number) => `Dies schließt alle offenen Bestellungen an Tisch ${number}.`,
    closing: 'WIRD GESCHLOSSEN...',
    closeAll: 'ALLE SCHLIESSEN',
    loadOrdersError: 'Bestellungen konnten nicht geladen werden.',
    updateOrderError: 'Bestellung konnte nicht aktualisiert werden.',
    closeDeskError: 'Bestellungen am Tisch konnten nicht geschlossen werden.',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
    closeLanguage: 'Sprachauswahl schließen',
  },
  en: {
    languageName: '🇺🇸',
    languageButton: 'Choose language',
    languageTitle: 'Staff language',
    orderId: 'Order ID',
    desk: (number) => `Desk ${number}`,
    item: 'Item',
    quantity: 'Qty',
    updating: 'UPDATING...',
    status: { NEW: 'NEW', ACCEPTED: 'ACCEPTED', PAID: 'PAID', CLOSED: 'CLOSED' },
    signOut: 'Sign out',
    staffConsole: 'Staff Console',
    soundOn: 'Sound on',
    enableSound: 'Enable sound',
    disableSound: 'Disable new order sound',
    liveRefresh: 'Live refresh',
    orderList: 'Order List',
    deskOverview: 'Desk Overview',
    staffViews: 'Staff views',
    noOrders: 'No orders have arrived yet.',
    noOrdersForDesk: 'No orders for this desk.',
    ordersCount: (count) => `Orders: ${count}`,
    noOrdersForDeskLabel: (number) => `Desk ${number}, no orders`,
    closeDeskConfirm: (count, number) => `Close all ${count} open orders for Desk ${number}? This cannot be undone.`,
    closeDeskWarning: (number) => `This closes every open order at Desk ${number}.`,
    closing: 'CLOSING...',
    closeAll: 'CLOSE ALL',
    loadOrdersError: 'Unable to load orders.',
    updateOrderError: 'Unable to update order.',
    closeDeskError: 'Unable to close desk orders.',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
    closeLanguage: 'Close language selection',
  },
  'zh-CN': {
    languageName: '🇨🇳',
    languageButton: '选择语言',
    languageTitle: '员工语言',
    orderId: '订单编号',
    desk: (number) => `桌号 ${number}`,
    item: '菜品',
    quantity: '数量',
    updating: '更新中...',
    status: { NEW: '新订单', ACCEPTED: '已接单', PAID: '已付款', CLOSED: '已关闭' },
    signOut: '退出登录',
    staffConsole: '员工工作台',
    soundOn: '声音已开启',
    enableSound: '开启声音',
    disableSound: '关闭新订单提示音',
    liveRefresh: '实时刷新',
    orderList: '订单列表',
    deskOverview: '桌台概览',
    staffViews: '员工视图',
    noOrders: '暂时没有新订单。',
    noOrdersForDesk: '该桌暂无订单。',
    ordersCount: (count) => `订单：${count}`,
    noOrdersForDeskLabel: (number) => `桌号 ${number}，暂无订单`,
    closeDeskConfirm: (count, number) => `确定关闭桌号 ${number} 的 ${count} 个未关闭订单吗？此操作无法撤销。`,
    closeDeskWarning: (number) => `此操作会关闭桌号 ${number} 的所有未关闭订单。`,
    closing: '关闭中...',
    closeAll: '全部关闭',
    loadOrdersError: '无法加载订单。',
    updateOrderError: '无法更新订单。',
    closeDeskError: '无法关闭该桌的订单。',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
    closeLanguage: '关闭语言选择',
  },
  'zh-TW': {
    languageName: '🇹🇼',
    languageButton: '選擇語言',
    languageTitle: '員工語言',
    orderId: '訂單編號',
    desk: (number) => `桌號 ${number}`,
    item: '菜品',
    quantity: '數量',
    updating: '更新中...',
    status: { NEW: '新訂單', ACCEPTED: '已接單', PAID: '已付款', CLOSED: '已關閉' },
    signOut: '登出',
    staffConsole: '員工工作台',
    soundOn: '聲音已開啟',
    enableSound: '開啟聲音',
    disableSound: '關閉新訂單提示音',
    liveRefresh: '即時更新',
    orderList: '訂單列表',
    deskOverview: '桌台概覽',
    staffViews: '員工視圖',
    noOrders: '暫時沒有新訂單。',
    noOrdersForDesk: '該桌暫無訂單。',
    ordersCount: (count) => `訂單：${count}`,
    noOrdersForDeskLabel: (number) => `桌號 ${number}，暫無訂單`,
    closeDeskConfirm: (count, number) => `確定關閉桌號 ${number} 的 ${count} 個未關閉訂單嗎？此操作無法撤銷。`,
    closeDeskWarning: (number) => `此操作會關閉桌號 ${number} 的所有未關閉訂單。`,
    closing: '關閉中...',
    closeAll: '全部關閉',
    loadOrdersError: '無法載入訂單。',
    updateOrderError: '無法更新訂單。',
    closeDeskError: '無法關閉該桌的訂單。',
    languageOptions: languageOptions({ de: 'Deutsch', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' }),
    closeLanguage: '關閉語言選擇',
  },
};

export function translateStaffSubtype(name: string, language: StaffLanguage) {
  const translations: Record<StaffLanguage, Record<string, string>> = {
    de: { Klein: 'Klein', Groß: 'Groß' },
    en: { Klein: 'Small', Groß: 'Large' },
    'zh-CN': { Klein: '小份', Groß: '大份' },
    'zh-TW': { Klein: '小份', Groß: '大份' },
  };

  return translations[language][name] ?? name;
}
