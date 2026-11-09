import { FormEvent, useEffect, useMemo, useState } from "react";

type Category = "Hot Coffee" | "Iced Coffee" | "Frappes" | "Non-Coffee Drinks" | "Pastries";
type Product = {
  id: number;
  name: string;
  category: Category;
  description: string;
  price: number;
  tag?: string;
  imagePos?: string;
};
type Options = {
  size: string;
  sugar: string;
  ice: string;
  milk: string;
  shots: number;
  topping: string;
};
type CartItem = {
  key: string;
  product: Product;
  options: Options;
  unitPrice: number;
  quantity: number;
};
type Page = "home" | "menu" | "cart" | "checkout" | "account" | "tracking";

const products: Product[] = [
  {
    id: 1,
    name: "Spanish Latte",
    category: "Hot Coffee",
    description: "Double espresso, velvety milk, and our signature dulce cream.",
    price: 175,
    tag: "Best seller",
    imagePos: "66% 45%",
  },
  {
    id: 2,
    name: "Brown Sugar Shaken",
    category: "Iced Coffee",
    description: "Espresso shaken with muscovado, cinnamon, and oat milk.",
    price: 195,
    tag: "New",
    imagePos: "73% 54%",
  },
  {
    id: 3,
    name: "Sea Salt Caramel",
    category: "Iced Coffee",
    description: "Cold brew crowned with salted caramel cloud cream.",
    price: 190,
    tag: "Popular",
    imagePos: "59% 56%",
  },
  {
    id: 4,
    name: "Classic Flat White",
    category: "Hot Coffee",
    description: "Rich ristretto with a thin layer of silky microfoam.",
    price: 160,
    imagePos: "68% 38%",
  },
  {
    id: 5,
    name: "Mocha Praliné Frappe",
    category: "Frappes",
    description: "Chocolate, coffee, hazelnut, and whipped cream.",
    price: 210,
    imagePos: "78% 45%",
  },
  {
    id: 6,
    name: "Matcha Cloud",
    category: "Non-Coffee Drinks",
    description: "Ceremonial matcha, fresh milk, and vanilla cloud foam.",
    price: 185,
    tag: "House favorite",
    imagePos: "63% 40%",
  },
  {
    id: 7,
    name: "Strawberry Cream",
    category: "Non-Coffee Drinks",
    description: "Real strawberry compote swirled into vanilla cream.",
    price: 180,
    imagePos: "71% 60%",
  },
  {
    id: 8,
    name: "Butter Croissant",
    category: "Pastries",
    description: "Flaky, all-butter pastry baked fresh every morning.",
    price: 115,
    imagePos: "84% 52%",
  },
  {
    id: 9,
    name: "Almond Kouign-amann",
    category: "Pastries",
    description: "Caramelized laminated pastry with almond frangipane.",
    price: 145,
    tag: "Limited",
    imagePos: "80% 65%",
  },
  {
    id: 10,
    name: "Café Americano",
    category: "Hot Coffee",
    description: "Our house espresso softened with filtered hot water.",
    price: 125,
    imagePos: "57% 45%",
  },
];

const categories: Array<"All" | Category> = [
  "All",
  "Hot Coffee",
  "Iced Coffee",
  "Frappes",
  "Non-Coffee Drinks",
  "Pastries",
];
const defaults: Options = {
  size: "Regular",
  sugar: "100%",
  ice: "Regular",
  milk: "Fresh milk",
  shots: 0,
  topping: "None",
};
const sizePrices: Record<string, number> = { Small: -15, Regular: 0, Large: 25 };
const milkPrices: Record<string, number> = { "Fresh milk": 0, Oat: 30, Almond: 30, Soy: 25 };
const toppingPrices: Record<string, number> = {
  None: 0,
  "Cream foam": 25,
  "Caramel drizzle": 20,
  "Coffee jelly": 25,
};
const money = (n: number) => `₱${n.toLocaleString("en-PH")}`;

function calculatePrice(product: Product, options: Options) {
  if (product.category === "Pastries") return product.price;
  return (
    product.price +
    sizePrices[options.size] +
    milkPrices[options.milk] +
    options.shots * 40 +
    toppingPrices[options.topping]
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Go home">
      <span>H</span>
      <b>Habi</b>
      <small>COFFEE CO.</small>
    </button>
  );
}

function Header({ page, count, go }: { page: Page; count: number; go: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const jump = (id: string) => {
    go("home");
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50);
  };
  return (
    <header className="header">
      <Logo onClick={() => go("home")} />
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        <i />
        <i />
      </button>
      <nav className={open ? "open" : ""}>
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => {
            go("home");
            setOpen(false);
          }}
        >
          Home
        </button>
        <button
          className={page === "menu" ? "active" : ""}
          onClick={() => {
            go("menu");
            setOpen(false);
          }}
        >
          Menu
        </button>
        <button onClick={() => jump("about")}>About</button>
        <button onClick={() => jump("promotions")}>Promotions</button>
        <button onClick={() => jump("contact")}>Contact</button>
      </nav>
      <div className="header-actions">
        <button className="login-link" onClick={() => go("account")}>
          Log in
        </button>
        <button className="cart-pill" onClick={() => go("cart")}>
          Bag <span>{count}</span>
        </button>
      </div>
    </header>
  );
}

function ProductImage({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div
      className={`product-photo ${large ? "large" : ""}`}
      style={{ backgroundPosition: product.imagePos }}
    >
      <img src="/coffee-hero.png" alt={product.name} />
      {product.tag && <span>{product.tag}</span>}
    </div>
  );
}

function ProductCard({ product, select }: { product: Product; select: (p: Product) => void }) {
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => select(product)}>
        <ProductImage product={product} />
      </button>
      <div className="product-copy">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div>
          <strong>{money(product.price)}</strong>
          <button
            className="round-add"
            onClick={() => select(product)}
            aria-label={`Customize ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function Customizer({
  product,
  initial,
  onClose,
  onAdd,
}: {
  product: Product;
  initial?: CartItem;
  onClose: () => void;
  onAdd: (options: Options, quantity: number) => void;
}) {
  const [options, setOptions] = useState(initial?.options || defaults);
  const [quantity, setQuantity] = useState(initial?.quantity || 1);
  const update = (key: keyof Options, value: string | number) =>
    setOptions((o) => ({ ...o, [key]: value }));
  const isPastry = product.category === "Pastries";
  const price = calculatePrice(product, options);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="customizer" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <ProductImage product={product} large />
        <div className="customizer-body">
          <p className="eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="muted">{product.description}</p>
          {!isPastry && (
            <>
              <Option
                label="Size"
                values={["Small", "Regular", "Large"]}
                current={options.size}
                onChange={(v) => update("size", v)}
                suffix={(v) =>
                  sizePrices[v] ? `${sizePrices[v] > 0 ? "+" : "−"}₱${Math.abs(sizePrices[v])}` : ""
                }
              />
              <Option
                label="Sugar level"
                values={["0%", "25%", "50%", "75%", "100%"]}
                current={options.sugar}
                onChange={(v) => update("sugar", v)}
              />
              {product.category !== "Hot Coffee" && (
                <Option
                  label="Ice level"
                  values={["No ice", "Light", "Regular", "Extra"]}
                  current={options.ice}
                  onChange={(v) => update("ice", v)}
                />
              )}
              <Option
                label="Milk"
                values={["Fresh milk", "Oat", "Almond", "Soy"]}
                current={options.milk}
                onChange={(v) => update("milk", v)}
                suffix={(v) => (milkPrices[v] ? `+₱${milkPrices[v]}` : "")}
              />
              <Option
                label="Extra shots"
                values={["0", "1", "2"]}
                current={String(options.shots)}
                onChange={(v) => update("shots", Number(v))}
                suffix={(v) => (Number(v) ? `+₱${Number(v) * 40}` : "")}
              />
              <Option
                label="Topping"
                values={["None", "Cream foam", "Caramel drizzle", "Coffee jelly"]}
                current={options.topping}
                onChange={(v) => update("topping", v)}
                suffix={(v) => (toppingPrices[v] ? `+₱${toppingPrices[v]}` : "")}
              />
            </>
          )}
          <div className="add-row">
            <div className="quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <b>{quantity}</b>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="primary grow" onClick={() => onAdd(options, quantity)}>
              {initial ? "Update bag" : "Add to bag"} · {money(price * quantity)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Option({
  label,
  values,
  current,
  onChange,
  suffix,
}: {
  label: string;
  values: string[];
  current: string;
  onChange: (v: string) => void;
  suffix?: (v: string) => string;
}) {
  return (
    <div className="option-group">
      <div className="option-label">
        <b>{label}</b>
        <span>{current}</span>
      </div>
      <div className="option-list">
        {values.map((v) => (
          <button className={current === v ? "selected" : ""} onClick={() => onChange(v)} key={v}>
            {v}
            <small>{suffix?.(v)}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function Home({ go, select }: { go: (p: Page) => void; select: (p: Product) => void }) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow light">ROASTED WITH INTENTION · MADE FOR YOU</p>
            <h1>
              Your Perfect Cup,
              <br />
              <em>Every Single Day.</em>
            </h1>
            <p>
              Thoughtfully sourced coffee, crafted with care, and delivered wherever your day takes
              you.
            </p>
            <div className="hero-actions">
              <button className="primary cream" onClick={() => go("menu")}>
                Order now <span>→</span>
              </button>
              <button
                className="text-btn light"
                onClick={() =>
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Our story
              </button>
            </div>
          </div>
          <div className="hero-note">
            <span>01</span>
            <p>
              Daily ritual
              <br />
              <b>Done beautifully.</b>
            </p>
          </div>
        </section>
        <section className="trust-row">
          <p>
            <span>Fresh</span> Roasted weekly
          </p>
          <p>
            <span>Local</span> Proudly Filipino
          </p>
          <p>
            <span>Fast</span> Pickup in 15 minutes
          </p>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CUSTOMER FAVORITES</p>
              <h2>
                Your usual,
                <br />
                <em>made exceptional.</em>
              </h2>
            </div>
            <button className="text-btn" onClick={() => go("menu")}>
              Explore full menu →
            </button>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} select={select} />
            ))}
          </div>
        </section>
        <section className="promo" id="promotions">
          <div className="promo-art">
            <div className="promo-cup">
              HABI
              <br />
              <small>COFFEE CO.</small>
            </div>
            <span className="bean one" />
            <span className="bean two" />
            <span className="bean three" />
          </div>
          <div className="promo-copy">
            <p className="eyebrow light">A LITTLE TREAT</p>
            <h2>
              Slow mornings
              <br />
              taste better.
            </h2>
            <p>
              Enjoy 20% off your first online order. Because your new favorite ritual deserves a
              proper introduction.
            </p>
            <div className="code">
              <span>Use code</span>
              <b>FIRSTSIP20</b>
            </div>
            <button className="primary cream" onClick={() => go("menu")}>
              Claim your 20% off
            </button>
          </div>
        </section>
        <section className="about section" id="about">
          <div className="about-photo">
            <img src="/coffee-hero.png" alt="A carefully made latte at Habi Coffee" />
            <span>
              EST.
              <br />
              <b>2021</b>
            </span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">OUR STORY</p>
            <h2>
              Good coffee.
              <br />
              <em>Good company.</em>
            </h2>
            <p>
              Habi means “to weave.” We started with a simple idea: coffee has a beautiful way of
              weaving people, places, and everyday moments together.
            </p>
            <p>
              Every cup begins with Philippine-grown beans, thoughtfully roasted and prepared by
              baristas who care about the details.
            </p>
            <button className="text-btn" onClick={() => go("menu")}>
              Taste the difference →
            </button>
            <div className="stats">
              <div>
                <b>4.9</b>
                <span>Average rating</span>
              </div>
              <div>
                <b>18k+</b>
                <span>Cups served</span>
              </div>
              <div>
                <b>100%</b>
                <span>Local beans</span>
              </div>
            </div>
          </div>
        </section>
        <section className="reviews">
          <p className="eyebrow">FROM OUR COMMUNITY</p>
          <blockquote>
            “The Spanish Latte is genuinely the best I’ve had in Manila. Ordering is easy, and it
            arrives tasting exactly like it does in the café.”
          </blockquote>
          <div className="reviewer">
            <span>MA</span>
            <p>
              <b>Mara A.</b>
              <small>Verified customer · Makati</small>
            </p>
          </div>
        </section>
        <section className="newsletter">
          <div>
            <p className="eyebrow light">STAY IN THE LOOP</p>
            <h2>
              Fresh brews,
              <br />
              straight to your inbox.
            </h2>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
              required
            />
            <button>Join the list →</button>
          </form>
        </section>
      </main>
      <Footer go={go} />
    </>
  );
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer id="contact">
      <div>
        <Logo onClick={() => go("home")} />
        <p>
          Thoughtfully crafted coffee
          <br />
          for your everyday rituals.
        </p>
      </div>
      <div>
        <b>Visit us</b>
        <p>
          128 Jupiter Street
          <br />
          Makati City, Metro Manila
        </p>
        <p>Mon–Sun · 7am–9pm</p>
      </div>
      <div>
        <b>Explore</b>
        <button onClick={() => go("menu")}>Menu</button>
        <button onClick={() => go("account")}>My account</button>
        <button onClick={() => go("tracking")}>Track order</button>
      </div>
      <div>
        <b>Say hello</b>
        <p>
          hello@habicoffee.ph
          <br />
          +63 917 123 4567
        </p>
      </div>
      <small>© 2026 Habi Coffee Co. All rights reserved.</small>
    </footer>
  );
}

function MenuPage({ select }: { select: (p: Product) => void }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [search, setSearch] = useState("");
  const shown = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (p.name + p.description).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main className="page">
      <div className="menu-title">
        <p className="eyebrow">OUR MENU</p>
        <h1>
          Find your <em>favorite.</em>
        </h1>
        <p>Each drink is made to order, just the way you like it.</p>
      </div>
      <div className="menu-tools">
        <div className="categories">
          {categories.map((c) => (
            <button
              key={c}
              className={c === category ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the menu"
          />
        </label>
      </div>
      <div className="product-grid menu-grid">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} select={select} />
        ))}
      </div>
      {!shown.length && (
        <div className="empty">
          <h2>No cups found</h2>
          <p>Try another search or category.</p>
        </div>
      )}
    </main>
  );
}

function CartPage({
  cart,
  go,
  changeQuantity,
  remove,
  edit,
}: {
  cart: CartItem[];
  go: (p: Page) => void;
  changeQuantity: (key: string, n: number) => void;
  remove: (key: string) => void;
  edit: (item: CartItem) => void;
}) {
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  if (!cart.length)
    return (
      <main className="page empty-cart">
        <span className="empty-bag">H</span>
        <p className="eyebrow">YOUR BAG</p>
        <h1>
          Your bag is <em>waiting.</em>
        </h1>
        <p>Add a favorite and we’ll make it exactly how you like it.</p>
        <button className="primary" onClick={() => go("menu")}>
          Browse the menu
        </button>
      </main>
    );
  return (
    <main className="page cart-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR ORDER</p>
        <h1>
          Your bag <em>({cart.reduce((s, i) => s + i.quantity, 0)})</em>
        </h1>
      </div>
      <div className="cart-layout">
        <section className="cart-list">
          {cart.map((item) => (
            <article className="cart-item" key={item.key}>
              <ProductImage product={item.product} />
              <div className="cart-item-copy">
                <p className="eyebrow">{item.product.category}</p>
                <h3>{item.product.name}</h3>
                <p>
                  {item.product.category === "Pastries"
                    ? "Freshly baked"
                    : `${item.options.size} · ${item.options.sugar} sugar · ${item.options.milk}${item.options.shots ? ` · +${item.options.shots} shot` : ""}${item.options.topping !== "None" ? ` · ${item.options.topping}` : ""}`}
                </p>
                <button onClick={() => edit(item)}>Edit customizations</button>
              </div>
              <div className="cart-item-end">
                <b>{money(item.unitPrice * item.quantity)}</b>
                <div className="quantity">
                  <button onClick={() => changeQuantity(item.key, item.quantity - 1)}>−</button>
                  <b>{item.quantity}</b>
                  <button onClick={() => changeQuantity(item.key, item.quantity + 1)}>+</button>
                </div>
                <button className="remove" onClick={() => remove(item.key)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>
        <aside className="summary">
          <h2>Order summary</h2>
          <div>
            <span>Subtotal</span>
            <b>{money(subtotal)}</b>
          </div>
          {discount && (
            <div className="discount">
              <span>FIRSTSIP20</span>
              <b>−{money(subtotal * 0.2)}</b>
            </div>
          )}
          <div>
            <span>Service fee</span>
            <b>₱0</b>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDiscount(promo.toUpperCase() === "FIRSTSIP20");
            }}
          >
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
            />
            <button>Apply</button>
          </form>
          <div className="total">
            <span>Total</span>
            <b>{money(subtotal * (discount ? 0.8 : 1))}</b>
          </div>
          <button className="primary" onClick={() => go("checkout")}>
            Continue to checkout →
          </button>
          <button className="continue" onClick={() => go("menu")}>
            Continue shopping
          </button>
        </aside>
      </div>
    </main>
  );
}

function Checkout({
  cart,
  placeOrder,
  go,
}: {
  cart: CartItem[];
  placeOrder: (info: Record<string, string>) => void;
  go: (p: Page) => void;
}) {
  const [method, setMethod] = useState("Delivery");
  const [payment, setPayment] = useState("Cash");
  const [error, setError] = useState("");
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!cart.length) return go("menu");
    if (!data.name || !data.email || !data.phone || (method === "Delivery" && !data.address)) {
      setError("Please complete all required details.");
      return;
    }
    placeOrder({ ...data, method, payment });
  };
  return (
    <main className="page checkout">
      <button className="back" onClick={() => go("cart")}>
        ← Back to bag
      </button>
      <div className="page-heading">
        <p className="eyebrow">ALMOST THERE</p>
        <h1>Checkout</h1>
      </div>
      <form onSubmit={submit}>
        <div className="checkout-form">
          <section>
            <h2>How would you like your order?</h2>
            <div className="big-options">
              {["Pickup", "Delivery"].map((m) => (
                <button
                  type="button"
                  className={method === m ? "selected" : ""}
                  onClick={() => setMethod(m)}
                  key={m}
                >
                  <b>{m}</b>
                  <small>
                    {m === "Pickup" ? "Ready in 15–20 minutes" : "Delivered in 35–50 minutes"}
                  </small>
                </button>
              ))}
            </div>
            <h2>Contact details</h2>
            <div className="fields">
              <label>
                Full name
                <input name="name" placeholder="Juan Dela Cruz" />
              </label>
              <label>
                Email address
                <input type="email" name="email" placeholder="juan@email.com" />
              </label>
              <label>
                Phone number
                <input name="phone" placeholder="+63 917 000 0000" />
              </label>
              {method === "Delivery" && (
                <label className="wide">
                  Delivery address
                  <textarea name="address" placeholder="Unit, street, barangay, city" />
                </label>
              )}
            </div>
            <h2>Payment</h2>
            <div className="big-options payment">
              {["Cash", "GCash", "Maya"].map((m) => (
                <button
                  type="button"
                  className={payment === m ? "selected" : ""}
                  onClick={() => setPayment(m)}
                  key={m}
                >
                  <b>{m}</b>
                  <small>
                    {m === "Cash"
                      ? "Pay upon receiving your order"
                      : "Secure payment on confirmation"}
                  </small>
                </button>
              ))}
            </div>
            {error && <p className="form-error">{error}</p>}
          </section>
          <aside className="summary checkout-summary">
            <h2>Your order</h2>
            {cart.map((i) => (
              <div className="mini-item" key={i.key}>
                <span>
                  {i.quantity}× {i.product.name}
                  <small>{i.options.size}</small>
                </span>
                <b>{money(i.unitPrice * i.quantity)}</b>
              </div>
            ))}
            <div className="total">
              <span>Total</span>
              <b>{money(total)}</b>
            </div>
            <button className="primary" type="submit">
              Place order · {money(total)}
            </button>
            <p className="fine">
              By placing this order, you agree to our terms. Payments are processed securely.
            </p>
          </aside>
        </div>
      </form>
    </main>
  );
}

function Tracking({
  order,
  go,
}: {
  order: { number: string; info: Record<string, string>; total: number } | null;
  go: (p: Page) => void;
}) {
  const stages =
    order?.info.method === "Pickup"
      ? ["Received", "Confirmed", "Preparing", "Ready for Pickup", "Completed"]
      : ["Received", "Confirmed", "Preparing", "Out for Delivery", "Completed"];
  return (
    <main className="page track-page">
      {order ? (
        <>
          <div className="order-success">
            <span>✓</span>
            <p className="eyebrow">ORDER CONFIRMED</p>
            <h1>Thanks, {order.info.name.split(" ")[0]}.</h1>
            <p>
              Your cup is officially in the works. We sent the confirmation to {order.info.email}.
            </p>
            <div>
              <small>ORDER NUMBER</small>
              <b>{order.number}</b>
            </div>
          </div>
          <section className="tracker">
            <div className="tracker-head">
              <div>
                <p className="eyebrow">LIVE ORDER STATUS</p>
                <h2>We’ve received your order.</h2>
              </div>
              <span>Est. {order.info.method === "Pickup" ? "15–20" : "35–50"} min</span>
            </div>
            <div className="stages">
              {stages.map((s, i) => (
                <div className={i === 0 ? "done" : ""} key={s}>
                  <i>{i === 0 ? "✓" : i + 1}</i>
                  <span>
                    <b>{s}</b>
                    <small>{i === 0 ? "Just now" : "We’ll update you here"}</small>
                  </span>
                </div>
              ))}
            </div>
            <div className="order-meta">
              <p>
                <span>Order</span>
                <b>{order.number}</b>
              </p>
              <p>
                <span>Method</span>
                <b>{order.info.method}</b>
              </p>
              <p>
                <span>Payment</span>
                <b>{order.info.payment}</b>
              </p>
              <p>
                <span>Total</span>
                <b>{money(order.total)}</b>
              </p>
            </div>
          </section>
          <button className="primary" onClick={() => go("menu")}>
            Order something else
          </button>
        </>
      ) : (
        <div className="empty">
          <p className="eyebrow">ORDER TRACKING</p>
          <h1>
            Track your <em>coffee.</em>
          </h1>
          <p>Your latest order status will appear here after checkout.</p>
          <button className="primary" onClick={() => go("menu")}>
            Start an order
          </button>
        </div>
      )}
    </main>
  );
}

function Account() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "profile">("login");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setMode("profile");
  };
  if (mode === "profile")
    return (
      <main className="page account profile">
        <div className="profile-card">
          <span>JD</span>
          <p className="eyebrow">MY PROFILE</p>
          <h1>Welcome, Juan.</h1>
          <p>juan@email.com · +63 917 000 0000</p>
          <div className="profile-tabs">
            <button className="active">Order history</button>
            <button>Personal details</button>
            <button>Addresses</button>
          </div>
          <div className="history">
            <p>No previous orders yet.</p>
            <small>Your delicious history will appear here.</small>
          </div>
          <button className="text-btn" onClick={() => setMode("login")}>
            Log out
          </button>
        </div>
      </main>
    );
  return (
    <main className="page account">
      <section className="account-art">
        <div>
          <p className="eyebrow light">WELCOME TO HABI</p>
          <h1>
            Your daily ritual,
            <br />
            <em>remembered.</em>
          </h1>
          <p>Save your favorites, reorder in a tap, and earn a little something with every cup.</p>
        </div>
      </section>
      <section className="auth-form">
        <Logo onClick={() => {}} />
        <p className="eyebrow">
          {mode === "forgot"
            ? "RESET PASSWORD"
            : mode === "signup"
              ? "JOIN THE COMMUNITY"
              : "WELCOME BACK"}
        </p>
        <h2>
          {mode === "forgot"
            ? "Find your account"
            : mode === "signup"
              ? "Create an account"
              : "Log in to Habi"}
        </h2>
        <p>
          {mode === "forgot"
            ? "We’ll send a reset link to your inbox."
            : mode === "signup"
              ? "Great coffee is even better with perks."
              : "Your favorites are waiting."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Full name
              <input required placeholder="Your full name" />
            </label>
          )}
          <label>
            Email address
            <input required type="email" placeholder="you@email.com" />
          </label>
          {mode !== "forgot" && (
            <label>
              Password
              <input required type="password" placeholder="At least 8 characters" />
            </label>
          )}
          <button className="primary">
            {mode === "forgot"
              ? "Send reset link"
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>
        {mode === "login" && (
          <button className="subtle" onClick={() => setMode("forgot")}>
            Forgot password?
          </button>
        )}
        <div className="auth-switch">
          {mode === "signup" ? "Already have an account?" : "New to Habi?"}{" "}
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Log in" : "Create an account"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("habi-cart") || "[]");
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState<Product | null>(null);
  const [editing, setEditing] = useState<CartItem | undefined>();
  const [order, setOrder] = useState<{
    number: string;
    info: Record<string, string>;
    total: number;
  } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("habi-order") || "null");
    } catch {
      return null;
    }
  });
  useEffect(() => localStorage.setItem("habi-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  const go = (p: Page) => setPage(p);
  const openProduct = (p: Product) => {
    setEditing(undefined);
    setSelected(p);
  };
  const add = (options: Options, quantity: number) => {
    if (!selected) return;
    const item: CartItem = {
      key: editing?.key || `${selected.id}-${Date.now()}`,
      product: selected,
      options,
      quantity,
      unitPrice: calculatePrice(selected, options),
    };
    setCart((c) => (editing ? c.map((i) => (i.key === editing.key ? item : i)) : [...c, item]));
    setSelected(null);
    setEditing(undefined);
  };
  const edit = (item: CartItem) => {
    setEditing(item);
    setSelected(item.product);
  };
  const count = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const placeOrder = (info: Record<string, string>) => {
    const next = {
      number: `HBC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      info,
      total: cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    };
    setOrder(next);
    localStorage.setItem("habi-order", JSON.stringify(next));
    setCart([]);
    setPage("tracking");
  };
  return (
    <div>
      <Header page={page} count={count} go={go} />
      {page === "home" && <Home go={go} select={openProduct} />}
      {page === "menu" && <MenuPage select={openProduct} />}
      {page === "cart" && (
        <CartPage
          cart={cart}
          go={go}
          edit={edit}
          remove={(key) => setCart((c) => c.filter((i) => i.key !== key))}
          changeQuantity={(key, n) =>
            n < 1
              ? setCart((c) => c.filter((i) => i.key !== key))
              : setCart((c) => c.map((i) => (i.key === key ? { ...i, quantity: n } : i)))
          }
        />
      )}
      {page === "checkout" && <Checkout cart={cart} placeOrder={placeOrder} go={go} />}
      {page === "tracking" && <Tracking order={order} go={go} />}
      {page === "account" && <Account />}
      {selected && (
        <Customizer
          product={selected}
          initial={editing}
          onClose={() => {
            setSelected(null);
            setEditing(undefined);
          }}
          onAdd={add}
        />
      )}
    </div>
  );
}
