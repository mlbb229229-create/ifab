// Local asset map (copied from the Pencil project)
const A = (n) => `/assets/${n}`

export const IMG = {
  persona: A('generated-1777201503182.png'),
  ipWaist: A('ip-waist.png'),
  me: A('unsplash-1587345136683-245016012e86.jpg'),
  luna: A('unsplash-1524504388940-b1c1722653e1.jpg'),
  mika: A('unsplash-1500648767791-00dcc994a43e.jpg'),
  nono: A('unsplash-1544005313-94ddf0286df2.jpg'),
  chen: A('unsplash-1544723795-3fb6469f5b39.jpg'),
  rita: A('unsplash-1525134479668-1bee5c7c6845.jpg'),
  jay: A('unsplash-1535713875002-d1d0cf377fde.jpg'),
  anan: A('unsplash-1546961329-78bef0414d7c.jpg'),
  mili: A('unsplash-1617386124435-9eb3935b1e11.jpg'),
  xiaolu: A('unsplash-1551734465-bf8cc92570f5.jpg'),
  jason: A('unsplash-1653071163478-177aa4035184.jpg'),
  passerA: A('unsplash-1490088715170-e367d03a58f7.jpg'),
  leader: A('unsplash-1568602471122-7832951cc4c5.jpg'),
  passerB: A('unsplash-1596883504669-8e45bfaac430.jpg'),
  meAvatar: A('unsplash-1750277389451-67259a1e451a.jpg'),
  wang: A('unsplash-1640175985386-2c89f649a938.jpg'),
  groupProduct: A('unsplash-1690192434971-ab3480ffe97f.jpg'),
  groupMove: A('unsplash-1522071820081-009f0129c71c.jpg'),
  lib1: A('unsplash-1431955277195-0f22b560a8e9.jpg'),
  lib2: A('unsplash-1481627834876-b7833e8f5570.jpg'),
  lib3: A('unsplash-1532437686671-7a4c1daee487.jpg'),
  lib4: A('unsplash-1572544405078-45963c80d026.jpg'),
}

export function Avatar({ src, size = 34, className = '', ring = false, rounded = 'full', onClick }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      onClick={onClick}
      className={`object-cover flex-none select-none ${rounded === 'full' ? 'rounded-full' : 'rounded-xl'} ${
        ring ? 'ring-1 ring-white/40' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
