import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import styles from './HomePage.module.css';
import {
  dashboardViews,
  demoUseCases,
  faqs,
  heroProofPoints,
  pricingPlans,
  pricingTrustNotes,
  problems,
  proofItems,
  proofStats,
  setupSteps,
  solutions,
  testimonials,
  trustChips,
  useCases,
} from '../../data/homepage';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  LINE_HANDLE,
  LOGIN_HREF,
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
  SECONDARY_CTA_HREF,
  SECONDARY_CTA_LABEL,
  SUPPORT_EMAIL,
} from '../../lib/site';

type ChatMessage = {
  side: 'user' | 'bot';
  text: string;
  meta?: string;
  variant?: 'message' | 'order';
};

const chatScript: ChatMessage[] = [
  { side: 'user', text: 'สวัสดีค่ะ ขอจองคิวทำเล็บพรุ่งนี้ช่วงเย็นได้ไหมคะ', meta: '21:42' },
  { side: 'bot', text: 'ได้เลยค่ะ พรุ่งนี้มีคิวว่าง 17:30 และ 19:00 สนใจช่วงไหนคะ', meta: '21:42' },
  { side: 'user', text: '17:30 ค่ะ แล้วลายเจลเพิ่มราคาเท่าไร', meta: '21:43' },
  { side: 'bot', text: 'ลายเจลเริ่มต้น +฿150 ค่ะ เดี๋ยวสรุปคิวและแจ้งทีมหน้าร้านให้ต่อได้เลย', meta: '21:43', variant: 'order' },
];

function LogoMark() {
  return (
    <span className={styles.logoMark} aria-hidden="true">
      <svg viewBox="0 0 30 30" fill="none">
        <rect width="30" height="30" rx="8" fill="#16A34A" />
        <path d="M7 12 L7 6.5 L12.5 12" fill="white" opacity="0.9" />
        <path d="M23 12 L23 6.5 L17.5 12" fill="white" opacity="0.9" />
        <ellipse cx="15" cy="17" rx="7.5" ry="6.5" fill="white" opacity="0.96" />
        <ellipse cx="12.3" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" />
        <ellipse cx="17.7" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" />
        <ellipse cx="15" cy="18.5" rx="0.9" ry="0.65" fill="#16A34A" />
      </svg>
    </span>
  );
}

function ChatMockup() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisibleCount((current) => (current >= chatScript.length ? 1 : current + 1));
    }, 1700);

    return () => window.clearInterval(timer);
  }, []);

  const visibleMessages = chatScript.slice(0, visibleCount);

  return (
    <div className={styles.chatWrap}>
      <div className={styles.phoneCard}>
        <div className={styles.phoneTopBar}>
          <div className={styles.avatar}>🐱</div>
          <div>
            <div className={styles.phoneTitle}>MeowChat Assistant</div>
            <div className={styles.phoneSubtitle}>ดูแลแชทบน LINE OA ให้ร้านคุณ</div>
          </div>
        </div>

        <div className={styles.chatBody}>
          {visibleMessages.map((message, index) => (
            <div
              key={`${message.side}-${index}`}
              className={message.side === 'user' ? styles.userMessage : styles.botMessage}
            >
              <div className={message.variant === 'order' ? styles.orderBubble : styles.chatBubble}>
                {message.variant === 'order' ? (
                  <>
                    <div className={styles.orderTitle}>สรุปคิวที่พร้อมยืนยัน</div>
                    <div className={styles.orderRow}>
                      <span>ทำเล็บเจล + ลายเจล</span>
                      <strong>฿650</strong>
                    </div>
                    <div className={styles.orderRowMuted}>วันพรุ่งนี้ 17:30 • สาขาพระราม 9</div>
                    <div className={styles.orderButton}>ยืนยันคิวนี้</div>
                  </>
                ) : (
                  message.text
                )}
              </div>
              {message.meta ? <span className={styles.messageMeta}>{message.meta}</span> : null}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sideBadge}>
        <span className={styles.sideBadgeIcon}>📌</span>
        <div>
          <strong>คัดเคสพร้อมซื้อให้ทีม</strong>
          <span>ตอบคำถามพื้นฐานเอง แล้วส่งต่อคนจริงเมื่อถึงจังหวะสำคัญ</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, invert = false }: { eyebrow: string; title: string; description: string; invert?: boolean }) {
  return (
    <div className={styles.sectionHeading}>
      <p className={invert ? styles.eyebrowInvert : styles.eyebrow}>{eyebrow}</p>
      <h2 className={invert ? styles.sectionTitleInvert : styles.sectionTitle}>{title}</h2>
      <p className={invert ? styles.sectionDescriptionInvert : styles.sectionDescription}>{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [activeUseCase, setActiveUseCase] = useState(useCases[0].id);
  const [activeDemoCase, setActiveDemoCase] = useState(demoUseCases[0].id);
  const [activeDashboardView, setActiveDashboardView] = useState(dashboardViews[0].id);

  const selectedUseCase = useMemo(
    () => useCases.find((item) => item.id === activeUseCase) ?? useCases[0],
    [activeUseCase]
  );

  const selectedDemoCase = useMemo(
    () => demoUseCases.find((item) => item.id === activeDemoCase) ?? demoUseCases[0],
    [activeDemoCase]
  );

  const selectedDashboardView = useMemo(
    () => dashboardViews.find((item) => item.id === activeDashboardView) ?? dashboardViews[0],
    [activeDashboardView]
  );

  return (
    <main className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.brand}>
              <LogoMark />
              <span>{BRAND_NAME}</span>
            </Link>

            <nav className={styles.navLinks} aria-label="เมนูหลัก">
              <a href="#problems">ทำไมต้องใช้</a>
              <a href="#usecases">เหมาะกับใคร</a>
              <a href="#workflow">เริ่มยังไง</a>
              <a href="#pricing">ราคา</a>
            </nav>

            <div className={styles.navActions}>
              <a href={LOGIN_HREF} className={styles.loginLink}>เข้าสู่ระบบ</a>
              <a href={PRIMARY_CTA_HREF} className={styles.primaryButtonSmall}>{PRIMARY_CTA_LABEL}</a>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroGlow} />
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.heroBadge}>ผู้ช่วยขายบน LINE OA สำหรับธุรกิจไทย</p>
              <h1 className={styles.heroTitle}>
                ให้ LINE OA ของร้าน
                <br />
                <span>ตอบไวขึ้น</span> และคัดลูกค้าพร้อมซื้อ
                <br />
                โดยยังไม่ต้องเพิ่มแอดมิน
              </h1>
              <p className={styles.heroDescription}>
                {BRAND_TAGLINE} ที่ช่วยรับคำถามซ้ำ เก็บออเดอร์หรือจองคิว
                แล้วส่งต่อเฉพาะเคสที่ควรใช้คนจริงปิดการขายต่อ เพื่อให้ทีมไม่จมกับแชทเดิม ๆ ค่ะ
              </p>
              <p className={styles.heroSubproof}>
                เหมาะกับร้านที่ใช้ LINE OA เป็นช่องทางหลัก และอยากเริ่มแก้จุดที่แชทตกก่อนเป็นอย่างแรก
              </p>

              <div className={styles.heroProofGrid}>
                {heroProofPoints.map((item) => (
                  <article key={item.value} className={styles.heroProofCard}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </article>
                ))}
              </div>

              <div className={styles.heroActions}>
                <a href={PRIMARY_CTA_HREF} className={styles.primaryButton}>{PRIMARY_CTA_LABEL}</a>
                <a href={SECONDARY_CTA_HREF} className={styles.secondaryButton}>{SECONDARY_CTA_LABEL}</a>
              </div>

              <div className={styles.trustChips}>
                {trustChips.map((chip) => (
                  <div key={chip.label} className={styles.trustChip}>
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <ChatMockup />
          </div>
        </div>
      </section>

      <section className={styles.proofBar} aria-label="ตัวอย่างธุรกิจที่เหมาะกับ MeowChat">
        <div className={styles.proofTrack}>
          {[...proofItems, ...proofItems].map((item, index) => (
            <div key={`${item.name}-${index}`} className={styles.proofItem}>
              <div className={styles.proofAvatar}>{item.icon}</div>
              <div>
                <div className={styles.proofStars}>★★★★★</div>
                <div>
                  <span className={styles.proofName}>{item.name}</span>
                  <span className={styles.proofQuote}> · {item.quote}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.proofStatsSection}>
        <div className={styles.container}>
          <div className={styles.proofStatsGrid}>
            {proofStats.map((item) => (
              <article key={item.value} className={styles.proofStatCard}>
                <strong>{item.value}</strong>
                <p>{item.label}</p>
                {item.note ? <span className={styles.proofStatNote}>{item.note}</span> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.demoSection}>
        <div className={styles.container}>
          <div className={styles.demoLead}>
            <SectionHeading
              eyebrow="USE CASE DEMO"
              title="ลูกค้าทักเรื่องไหน MeowChat ช่วยร้านตอบและพาไปต่อได้บ้าง"
              description="กดดูตัวอย่างงานที่ร้านใช้ได้จริงใน LINE OA แล้วดูว่าแต่ละเคส ระบบช่วยตอบอะไร เก็บอะไร และส่งต่อทีมตอนไหนค่ะ"
            />

            <div className={styles.tabRow} aria-label="ตัวอย่างงานที่ MeowChat ช่วยได้">
              {demoUseCases.map((item) => {
                const isActive = item.id === activeDemoCase;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? styles.activeTab : styles.tabButton}
                    aria-pressed={isActive}
                    onClick={() => setActiveDemoCase(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.demoGrid}>
            <div className={styles.demoNarrative}>
              <div className={styles.demoHighlights}>
                {selectedDemoCase.chips.map((item) => (
                  <div key={item} className={styles.demoHighlightChip}>
                    <span aria-hidden="true">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <article className={styles.demoNarrativeCard}>
                <span className={styles.demoCaseEyebrow}>{selectedDemoCase.eyebrow}</span>
                <h3>{selectedDemoCase.title}</h3>
                <p>{selectedDemoCase.handoffDetail}</p>
              </article>

              <div className={styles.demoOutcomeList}>
                {selectedDemoCase.outcomes.map((item) => (
                  <div key={item} className={styles.demoOutcomeItem}>
                    <span aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.demoPlayerCard}>
              <div className={styles.demoPlayerTop}>
                <span className={styles.demoPlayerLabel}>{selectedDemoCase.label}</span>
                <span className={styles.demoPlayerLength}>ตัวอย่างการตอบจริง</span>
              </div>

              <div className={styles.demoConversation}>
                <div className={styles.demoConversationGlow} />

                <div className={styles.demoMessageUser}>
                  <span className={styles.demoMessageTag}>ลูกค้าถาม</span>
                  <p className={styles.demoMessageBody}>{selectedDemoCase.customerMessage}</p>
                </div>

                <div className={styles.demoMessageBot}>
                  <span className={styles.demoMessageTag}>MeowChat ตอบ</span>
                  <p className={styles.demoMessageBody}>{selectedDemoCase.assistantMessage}</p>
                </div>

                <div className={styles.demoNextStepCard}>
                  <span className={styles.demoNextStepLabel}>{selectedDemoCase.handoffTitle}</span>
                  <strong>{selectedDemoCase.handoffDetail}</strong>
                </div>
              </div>

              <div className={styles.demoSupportBox}>
                <strong>เริ่มจาก use case เดียวที่ร้านใช้จริงก่อนก็ได้</strong>
                <p>ไม่ต้องรื้อทั้งระบบตั้งแต่วันแรก เลือก flow ที่ลูกค้าทักบ่อยที่สุด แล้วค่อยขยายเมื่อร้านพร้อมค่ะ</p>
                <div className={styles.demoSupportActions}>
                  <a href={PRIMARY_CTA_HREF} className={styles.primaryButtonSmall}>{PRIMARY_CTA_LABEL}</a>
                  <a href="#pricing" className={styles.demoTextLink}>ดูแพ็กที่เหมาะกับร้าน</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problems" className={styles.lightSection}>
        <div className={styles.container}>
          <div className={styles.twoColumnFeature}>
            <div>
              <SectionHeading
                eyebrow="PAIN POINTS"
                title="ปัญหาที่ร้านส่วนใหญ่เจอ ไม่ได้อยู่ที่ลูกค้าไม่สนใจ แต่อยู่ที่ตอบไม่ทัน"
                description="ถ้าลูกค้าทักมาแล้วไม่มีใครตอบ หรือบทสนทนาไม่พาไปต่อ โอกาสขายก็หายไปทั้งที่ความสนใจเกิดขึ้นแล้ว"
              />
              <div className={styles.cardStack}>
                {problems.map((item) => (
                  <article key={item.title} className={styles.problemCard}>
                    <div className={styles.problemIcon}>{item.icon}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="MEOWCHAT HELPS"
                title="MeowChat ช่วยให้ LINE OA ตอบไวขึ้น และพาลูกค้าไปต่อได้เป็นระบบ"
                description="ไม่ได้พยายามแทนทีมทั้งหมด แต่ช่วยรับภาระงานซ้ำ ๆ และช่วยส่งมอบเคสที่พร้อมให้ทีมปิดการขายต่อได้ไวขึ้น"
              />
              <div className={styles.cardStack}>
                {solutions.map((item) => (
                  <article key={item.title} className={styles.solutionCard}>
                    <div className={styles.solutionIcon}>{item.icon}</div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="usecases" className={styles.mutedSection}>
        <div className={styles.container}>
          <SectionHeading
            eyebrow="WHO IT FITS"
            title="เหมาะกับธุรกิจที่ใช้ LINE OA เป็นหน้าร้านดิจิทัลจริง ๆ"
            description="เลือกดู use case ที่ใกล้กับธุรกิจคุณ เพื่อเห็นภาพว่า MeowChat จะช่วยตรงไหนก่อนเป็นอันดับแรก"
          />

          <div className={styles.tabRow} role="tablist" aria-label="กลุ่มธุรกิจ">
            {useCases.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id == activeUseCase ? styles.activeTab : styles.tabButton}
                onClick={() => setActiveUseCase(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className={styles.useCasePanel}>
            <div className={styles.useCaseCopy}>
              <p className={styles.useCaseAudience}>{selectedUseCase.audience}</p>
              <h3>{selectedUseCase.outcome}</h3>
              <div className={styles.listColumns}>
                <div>
                  <h4>ปัญหาที่เจอบ่อย</h4>
                  <ul>
                    {selectedUseCase.pains.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>สิ่งที่ MeowChat ช่วยได้</h4>
                  <ul>
                    {selectedUseCase.automation.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <aside className={styles.replyCard}>
              <p className={styles.replyLabel}>ตัวอย่างโทนตอบลูกค้า</p>
              <p className={styles.replyText}>{selectedUseCase.sampleReply}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.container}>
          <div className={styles.showcaseHeaderRow}>
            <SectionHeading
              eyebrow={selectedDashboardView.eyebrow}
              title={selectedDashboardView.title}
              description={selectedDashboardView.description}
              invert
            />

            <div className={styles.dashboardTabs}>
              {dashboardViews.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === activeDashboardView ? styles.dashboardTabActive : styles.dashboardTab}
                  onClick={() => setActiveDashboardView(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.dashboardCard}>
            <div className={styles.metricGrid}>
              {selectedDashboardView.metrics.map((metric) => (
                <article key={metric.label} className={styles.metricCard}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.hint}</p>
                </article>
              ))}
            </div>

            <div className={styles.dashboardDetailRow}>
              <div className={styles.panelCard}>
                <div className={styles.panelCardTitle}>สิ่งที่เจ้าของร้านจะเห็น</div>
                <ul className={styles.bulletListDark}>
                  {selectedDashboardView.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.panelCardAccent}>
                <div className={styles.panelCardTitle}>เหตุผลที่ร้านเริ่มได้ง่าย</div>
                <p>
                  เริ่มจากคำถามที่ลูกค้าถามบ่อยหรือ flow เดียวก่อน แล้วค่อยขยายเมื่อร้านพร้อม โดยไม่ต้องรื้อวิธีทำงานทั้งระบบตั้งแต่วันแรกค่ะ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.lightSection}>
        <div className={styles.container}>
          <SectionHeading
            eyebrow="TRUST & RESULTS"
            title="หลักฐานที่ช่วยให้เจ้าของร้านตัดสินใจได้ง่ายขึ้น"
            description="หน้า landing ควรพิสูจน์ว่าระบบนี้ช่วยลดแชทตก ลดงานตอบซ้ำ และทำให้ทีมโฟกัสเคสพร้อมซื้อได้มากขึ้น ไม่ใช่แค่พูดว่าเป็น AI อย่างเดียว"
          />

          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <article key={item.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>★★★★★</div>
                <p className={styles.testimonialQuote}>{item.quote}</p>
                <p className={styles.testimonialResult}>{item.result}</p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.testimonialAvatar}>{item.icon}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={styles.mutedSection}>
        <div className={styles.container}>
          <SectionHeading
            eyebrow="PRICING"
            title="เลือกแพ็กตามจังหวะของร้าน ไม่ต้องซื้อเกินสิ่งที่ใช้จริง"
            description="ช่วยให้เจ้าของร้านตัดสินใจง่ายขึ้นว่าเริ่มจากอะไรดี และเมื่อไรควรขยาย flow เพื่อให้ทีมตอบไวขึ้นและปิดการขายได้ลื่นขึ้น"
          />

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <article key={plan.name} className={plan.highlight ? styles.pricingCardHighlight : styles.pricingCard}>
                {plan.badge ? <span className={styles.planBadge}>{plan.badge}</span> : null}
                <h3>{plan.name}</h3>
                <div className={styles.planFitLabel}>{plan.fitLabel}</div>
                <div className={styles.planPrice}>{plan.price}</div>
                <p className={styles.planDescription}>{plan.description}</p>
                <p className={styles.planAudience}>{plan.audience}</p>
                <div className={styles.planOutcome}>{plan.outcome}</div>
                <ul className={styles.planFeatureList}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a href={plan.highlight ? PRIMARY_CTA_HREF : SECONDARY_CTA_HREF} className={plan.highlight ? styles.primaryButtonBlock : styles.secondaryButtonBlock}>
                  {plan.ctaLabel}
                </a>
                <p className={styles.planNote}>{plan.ctaNote}</p>
              </article>
            ))}
          </div>

          <div className={styles.pricingTrustBar}>
            {pricingTrustNotes.map((item) => (
              <div key={item} className={styles.pricingTrustItem}>
                <span>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className={styles.lightSection}>
        <div className={styles.container}>
          <SectionHeading
            eyebrow="GET STARTED"
            title="เริ่มต้นแบบไม่ซับซ้อน ค่อย ๆ วาง flow ให้เข้ากับร้านจริง"
            description="หน้าเว็บควรสื่อว่าระบบนี้ไม่ได้ยากสำหรับ SME ไทย และทีมพร้อมช่วยวางของที่จำเป็นก่อนเสมอ"
          />

          <div className={styles.stepGrid}>
            {setupSteps.map((step, index) => (
              <article key={step.title} className={styles.stepCard}>
                <div className={styles.stepNumber}>0{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.container}>
          <SectionHeading
            eyebrow="FAQ"
            title="คำถามที่เจ้าของร้านมักอยากรู้ก่อนเริ่มใช้"
            description="ให้คำตอบแบบมั่นใจ ตรงไปตรงมา และช่วยลดแรงเสียดทานก่อนทดลองใช้จริง"
          />

          <div className={styles.faqList}>
            {faqs.map((item) => (
              <article key={item.question} className={styles.faqCard}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div>
              <p className={styles.eyebrow}>READY TO START</p>
              <h2 className={styles.ctaTitle}>เริ่มจัดการ LINE OA ของร้านคุณให้ตอบไวขึ้น และไม่ปล่อยลูกค้าพร้อมซื้อหลุดมือ</h2>
              <p className={styles.ctaDescription}>
                เริ่มจาก use case เดียวก่อนก็ได้ค่ะ เช่น คำถามซ้ำ การรับออเดอร์ หรือการจองคิว แล้วค่อยขยายเมื่อร้านพร้อม
              </p>
              <div className={styles.ctaSupportList}>
                <div className={styles.ctaSupportItem}>✓ ไม่ต้องมีทีมเทคนิคก็เริ่มได้</div>
                <div className={styles.ctaSupportItem}>✓ คุยกับทีมเพื่อช่วยเลือกแพ็กที่เหมาะกับร้านได้</div>
                <div className={styles.ctaSupportItem}>✓ เหมาะกับร้านที่ใช้ LINE OA เป็นช่องทางหลัก</div>
              </div>
            </div>
            <div className={styles.ctaActionsWrap}>
              <div className={styles.ctaActions}>
                <a href={PRIMARY_CTA_HREF} className={styles.primaryButton}>{PRIMARY_CTA_LABEL}</a>
                <a href={SECONDARY_CTA_HREF} className={styles.secondaryButton}>{SECONDARY_CTA_LABEL}</a>
              </div>
              <p className={styles.ctaMicrocopy}>ถ้ายังไม่แน่ใจว่าเริ่มจากแพ็กไหน ทักมาคุยก่อนแล้วค่อยตัดสินใจได้ค่ะ</p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <div className={styles.footerBrand}>
                <LogoMark />
                <strong>{BRAND_NAME}</strong>
              </div>
              <p>{BRAND_TAGLINE}</p>
            </div>

            <div className={styles.footerMeta}>
              <a href={LOGIN_HREF}>เข้าสู่ระบบ</a>
              <a href={PRIMARY_CTA_HREF}>สมัครใช้งาน</a>
              <a href={SECONDARY_CTA_HREF}>LINE OA {LINE_HANDLE}</a>
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
