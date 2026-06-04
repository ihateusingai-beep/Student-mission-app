# Student Mission App - Ghibli Asset Manifest
Generated: 2026-06-04 | Style: Studio Ghibli (soft pastel watercolor)

## 📁 Structure
```
public/assets/
├── pets/
│   ├── stage1/  (6 types: dog, cat, rabbit, bear, frog, dragon)
│   ├── stage2/  (evolved forms)
│   └── stage3/  (ultimate forms)
├── badges/      (8 achievement badges)
└── rewards/     (5 reward items)
```

## 🐾 Pets (18 images)
| File | Type | Stage |
|------|------|-------|
| pets/stage1/dog.jpg | 🐕 小狗 | Stage 1 |
| pets/stage1/cat.jpg | 🐱 小貓 | Stage 1 |
| pets/stage1/rabbit.jpg | 🐰 小兔 | Stage 1 |
| pets/stage1/bear.jpg | 🐻 小熊 | Stage 1 |
| pets/stage1/frog.jpg | 🐸 青蛙 | Stage 1 |
| pets/stage1/dragon.jpg | 🐉 小龍 | Stage 1 |
| pets/stage2/dog.jpg | 黃金進化狗 | Stage 2 |
| pets/stage2/cat.jpg | 銀月進化貓 | Stage 2 |
| pets/stage2/rabbit.jpg | 花冠進化兔 | Stage 2 |
| pets/stage2/bear.jpg | 森林守護熊 | Stage 2 |
| pets/stage2/frog.jpg | 竹林賢者蛙 | Stage 2 |
| pets/stage2/dragon.jpg | 薰衣草雲龍 | Stage 2 |
| pets/stage3/dog.jpg | 黃金守護神犬 | Stage 3 |
| pets/stage3/cat.jpg | 星辰天穹貓 | Stage 3 |
| pets/stage3/rabbit.jpg | 月光魔法兔 | Stage 3 |
| pets/stage3/bear.jpg | 古老森林熊賢者 | Stage 3 |
| pets/stage3/frog.jpg | 水晶聖蓮蛙 | Stage 3 |
| pets/stage3/dragon.jpg | 彩虹虹光大龍 | Stage 3 |

## 🏅 Badges (8 images)
| File | Badge |
|------|-------|
| badges/first_task.jpg | 初戰告捷 |
| badges/streak_7.jpg | 連續達人 (7日) |
| badges/streak_30.jpg | 一個月堅持 (30日) |
| badges/points_100.jpg | 點數達人 (100點) |
| badges/points_500.jpg | 點數英雄 (500點) |
| badges/badges_5.jpg | 徽章獵人 (5個) |
| badges/all_categories.jpg | 全能挑戰者 |
| badges/pet_master.jpg | 寵物大師 (Lv.3) |

## 🎁 Rewards (5 images)
| File | Reward |
|------|--------|
| rewards/gift_box.jpg | 魔法禮物盒 |
| rewards/lollipop.jpg | 彩虹棒棒糖 |
| rewards/treasure.jpg | 寶藏箱 |
| rewards/icecream.jpg | 魔法雪糕 |
| rewards/flowers.jpg | 魔法花束 |

## 🔗 Access URLs (after deploy)
```
/assets/pets/stage1/dog.jpg
/assets/badges/first_task.jpg
/assets/rewards/gift_box.jpg
```

## 📝 Integration Notes
- Game store: `src/stores/game.js` → pet types need `image` field
- Badge display: Replace emoji `icon` with `<img>` tags
- Reward display: Replace emoji `icon` with `<img>` tags
- Use CSS `object-fit: contain` for square containers
