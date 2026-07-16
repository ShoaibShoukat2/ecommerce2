import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

function Section({ title, id, children }) {
  return (
    <section id={id} className="mb-12 scroll-mt-28">
      <h2 className="font-display text-2xl font-semibold text-white mb-4 pb-2 border-b border-dark-700">
        {title}
      </h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-4">{children}</div>
    </section>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mt-6">
      {title && <h3 className="text-white font-medium mb-2">{title}</h3>}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function List({ items }) {
  return (
    <ol className="list-decimal list-inside space-y-3 marker:text-gold-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc list-inside space-y-2 marker:text-gold-400 ml-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function ContactBox({ title = 'Grievance Contact' }) {
  return (
    <div className="mt-4 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
      <p className="text-white font-medium mb-2">{title}</p>
      <p>Manager Name: Anas Khan</p>
      <p>Designation: Grievance & Compliance Manager</p>
      <p>Company: UKVI Services</p>
      <p>Email: ukviservice01@gmail.com</p>
      <p>Phone: +91 9100690057</p>
      <p>Working Hours: Monday – Friday, 09:00 – 18:00</p>
    </div>
  );
}

const tocLinks = [
  { id: 'terms-and-conditions', label: 'Terms & Conditions' },
  { id: 'privacy-policy', label: 'Privacy Policy' },
  { id: 'refund-and-cancellation-policy', label: 'Refund & Cancellation' },
  { id: 'return-policy', label: 'Return & Exchange' },
  { id: 'shipping-policy', label: 'Shipping Policy' },
];

export default function TermsConditions() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
            <FileText className="text-dark-950" size={22} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold gold-text">
            Legal Policies
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Last updated: July 2026 · ukviservices.com
        </p>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {tocLinks.map((link) => (
          <Link
            key={link.id}
            to={`/terms#${link.id}`}
            className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-dark-700 text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium p-6 md:p-10"
      >
        <Section title="Terms & Conditions" id="terms-and-conditions">
          <p>
            This complete policy set is published in compliance with Rule 3(1) of the Information Technology
            (Intermediaries Guidelines) Rules, 2011 and the Information Technology Act, 2000. All clauses are
            legally binding for every user, buyer, visitor accessing ukviservices.com, our mobile site and official
            mobile application (collectively "the Platform").
          </p>
          <p>
            UKVI Services operates an e‑commerce platform selling premium branded fashion, apparel, accessories,
            footwear, home lifestyle goods and related merchandise. All transactions, account creation, browsing,
            checkout and post‑purchase services are regulated under the below policies.
          </p>
          <p>
            By visiting, registering, browsing or placing any order on our Platform, you unconditionally accept every
            term laid out in this document. If you disagree with any policy clause, you must refrain from using our
            website, app or purchasing any products from UKVI Services.
          </p>

          <SubSection title="1. Document Legal Status">
            <p>
              This entire policy document qualifies as a valid electronic record under the Information Technology
              Act, 2000 and all applicable state and central Indian statutes governing electronic records. Being
              computer system generated, this document does not require physical ink signatures or digital signature
              certificates to hold legal validity in Indian courts.
            </p>
            <p>
              All rules, user guidelines, privacy norms and transaction policies are published mandatorily as per IT
              Intermediaries Rules 2011 for domain ukviservices.com and its associated digital properties.
            </p>
          </SubSection>

          <SubSection title="2. Platform Ownership & Identity">
            <p>
              The Platform (website, mobile site, mobile application) is wholly owned, managed and operated by UKVI
              Services, registered under Companies Act 1956 with registered office situated at Bandlaguda Khalsa,
              Hyderabad, Telangana State, India.
            </p>
            <p>Throughout this document:</p>
            <BulletList items={[
              '"UKVI Services", "we", "us", "our" = Platform Owner',
              '"User", "you", "your", "buyer", "customer" = any person accessing or purchasing goods on the Platform',
              '"Services" = all fashion & lifestyle product sales, customer support, order tracking, delivery assistance, account management tools offered via ukviservices.com',
            ]} />
          </SubSection>

          <SubSection title="3. Binding Contract Between User & UKVI Services">
            <p>
              Your use of the Platform automatically creates a legally enforceable contract between you and UKVI
              Services. All terms written in this document, alongside all referenced supplementary policies (Privacy,
              Refund, Return, Shipping), form your legal obligations.
            </p>
            <p>
              Any separate terms, conditions or demands you propose that conflict with or add extra obligations to
              this official policy are fully rejected and hold zero legal effect.
            </p>
            <p>
              UKVI Services reserves full rights to revise, edit, add or remove any clause in these Terms &
              Conditions at any time without prior notice or justification. It is your sole responsibility to revisit
              this policy regularly to stay updated on amendments.
            </p>
          </SubSection>

          <SubSection title="4. User Definition">
            <p>
              "User" includes all natural persons (individual customers) and legal entities (business buyers, gifting
              agencies) who register an account, browse products, add items to cart, complete checkout or interact
              with customer support on ukviservices.com. Minors below 18 years of age may only use the Platform under
              parental/legal guardian supervision and consent.
            </p>
          </SubSection>

          <SubSection title="5. Acceptance of Terms">
            <p>
              Simply opening the website, scrolling product pages, creating an account, adding items to cart or
              completing checkout constitutes your full, unreserved agreement to all Terms & Conditions listed here.
              We strongly advise all users to read this full document thoroughly before making any purchase.
            </p>
          </SubSection>

          <SubSection title="6. Account Registration & User Responsibilities">
            <List items={[
              'During signup and post‑registration, you must submit genuine, complete, accurate personal details including full name, active mobile number, valid email address, delivery address and identity documents (if requested).',
              'You are 100% liable for every action, order, query, payment request placed through your registered account. You must secure your login ID and password; never share account credentials with third parties. Any fraudulent activity arising from leaked login details will be your sole responsibility.',
              'Notify UKVI Services support immediately if your account is hacked, compromised or accessed by an unknown party.',
            ]} />
          </SubSection>

          <SubSection title="7. Disclaimers & No Warranties">
            <p>UKVI Services and all partner brands, logistics vendors, payment gateways do not provide any warranty regarding:</p>
            <BulletList items={[
              'Exact colour matching of fashion apparel, footwear and lifestyle products (screen display variations may exist)',
              'Timeliness of website loading, stock availability or delivery schedules',
              'Completeness, error‑free nature of product descriptions, size charts, pricing and promotional offers',
            ]} />
            <p>
              All product information is provided for reference only and may contain minor typographical or photographic
              errors. To the maximum limit allowed under Indian consumer laws, UKVI Services disclaims all liability
              for losses arising from such informational inaccuracies.
            </p>
          </SubSection>

          <SubSection title="8. User Risk Assumption">
            <p>
              All browsing, shopping and transaction activities on the Platform are undertaken at your own full risk.
              UKVI Services is not liable for any financial loss, time loss, opportunity loss or inconvenience faced
              due to website downtime, stock unavailability, courier delays or third‑party payment failures. You must
              independently verify product sizes, material, specifications before placing orders.
            </p>
          </SubSection>

          <SubSection title="9. Intellectual Property Ownership">
            <p>
              All content hosted on ukviservices.com is the exclusive intellectual property of UKVI Services and
              partnered fashion brands, including but not limited to: website design, page layout, brand logos,
              product photographs, graphic banners, text descriptions, size guides, campaign artwork.
            </p>
            <p>
              You are prohibited from copying, downloading, screenshotting, redistributing, editing or commercialising
              any Platform content without written formal approval from UKVI Services. Unauthorised reproduction will
              attract legal action for copyright infringement under Indian IP laws.
            </p>
          </SubSection>

          <SubSection title="10. Prohibited Uses of the Platform">
            <p>You agree to never utilise the website, app or our services for any illegal, unlawful or policy‑violating activity including:</p>
            <BulletList items={[
              'Fraudulent orders, fake payment attempts, return fraud, duplicate refund claims',
              'Reselling bulk purchased branded fashion goods without official reseller partnership with UKVI Services',
              'Uploading harmful files, spam messages, abusive comments, hate speech on product review sections',
              'Circumventing discount rules, promotional coupon limits or multi‑account manipulation',
              'Violating Indian cyber laws, consumer protection laws or local Telangana state regulations',
            ]} />
            <p>Any breach of this clause will result in immediate account suspension, order cancellation and permanent ban from the Platform.</p>
          </SubSection>

          <SubSection title="11. Third‑Party Website Links">
            <p>
              Our Platform may embed hyperlinks to brand partner websites, payment gateway portals, courier tracking
              sites and social media pages. Once you click external links, you exit the UKVI Services ecosystem and
              become subject to that third party's own terms of service and privacy policy.
            </p>
            <p>
              UKVI Services holds no responsibility for data collection, security standards or business practices of
              external linked websites. We recommend reviewing their policies before submitting personal data.
            </p>
          </SubSection>

          <SubSection title="12. Transaction Legal Binding Effect">
            <p>
              Once you complete payment checkout for any fashion or lifestyle product, you enter a legally valid sales
              contract with UKVI Services for the ordered goods. All delivery, refund and return obligations activate
              immediately upon successful payment confirmation.
            </p>
          </SubSection>

          <SubSection title="13. Indemnification Clause">
            <p>
              You shall fully indemnify, defend and hold harmless UKVI Services, its directors, staff, delivery
              partners, affiliated brand vendors against all third‑party claims, legal notices, fines, penalties and
              attorney fees arising from:
            </p>
            <BulletList items={[
              'Your breach of any clause in these Terms & Conditions, Privacy Policy or supporting policies',
              'Your violation of Indian national or Telangana state laws',
              'Infringement of third‑party copyright, trademark or personal rights originating from your account activity',
              'Fraudulent returns, fake damage claims or false customer complaints filed by you',
            ]} />
          </SubSection>

          <SubSection title="14. Force Majeure">
            <p>
              UKVI Services will not be held accountable for delayed or failed order fulfilment caused by events
              outside reasonable human control, including natural disasters, nationwide transport strikes, government
              lockdowns, courier service suspension, internet outages, supply chain breakdowns, pandemics and
              regulatory trade restrictions. During force majeure events, delivery timelines will be automatically
              extended without compensation claims applicable.
            </p>
          </SubSection>

          <SubSection title="15. Governing Law & Jurisdiction">
            <p>
              All disputes, claims, contractual disagreements related to this document and your purchases on
              ukviservices.com shall be governed exclusively by the laws of India, with primary jurisdiction restricted
              to civil courts situated in Hyderabad, Telangana. No other state or international courts will have
              authority over any conflict arising from Platform usage.
            </p>
          </SubSection>

          <SubSection title="16. Official Communication Channel">
            <p>
              All complaints, policy queries, account disputes and formal notices must be sent via our official
              registered email support channel listed on the website contact page. Informal social media messages will
              not be treated as legal official communication.
            </p>
          </SubSection>
        </Section>

        <Section title="Privacy Policy" id="privacy-policy">
          <SubSection title="1. Policy Overview">
            <p>
              This Privacy Policy governs how UKVI Services (Grievance Officer: Anas Khan, Contact: +91 9100690057)
              collects, stores, uses, shares, secures and deletes your personal and sensitive data across
              ukviservices.com fashion & lifestyle e‑commerce Platform.
            </p>
            <p>
              You may browse limited product pages without account registration, but full checkout, order tracking and
              customer support access require mandatory data submission. All user data is primarily stored and
              processed within Indian servers in compliance with national data protection norms.
            </p>
            <p>
              By registering, placing orders or submitting personal information on our website, you fully consent to
              all data processing practices outlined in this policy. If you refuse data collection terms, you cannot
              create an account or complete purchases.
            </p>
          </SubSection>

          <SubSection title="2. Categories of Data We Collect">
            <p className="text-gray-300 font-medium">2.1 Basic Personal Data (Mandatory for Account Creation)</p>
            <p>
              Full legal name, date of birth, permanent residential address, delivery shipping address, active mobile
              contact number, primary email ID, alternate contact details, identity proof documents (Aadhaar/PAN when
              requested for high‑value orders).
            </p>
            <p className="text-gray-300 font-medium mt-4">2.2 Transaction & Behavioural Data</p>
            <p>
              Order history, purchased fashion/lifestyle items, cart abandonment records, clicked product categories,
              size preferences, search keywords, discount coupon usage, payment history, return/refund requests,
              customer support chat logs. We aggregate this anonymised data for internal platform performance analysis
              without identifying individual users.
            </p>
            <p className="text-gray-300 font-medium mt-4">2.3 Sensitive Financial Data (Collected with Explicit Consent Only)</p>
            <p>
              Bank account numbers, credit/debit card details, UPI IDs, digital wallet credentials required for payment
              processing. We never store full card CVV data on our servers; payment transactions are routed through
              secure PCI‑DSS certified third‑party gateways.
            </p>
            <p className="text-gray-300 font-medium mt-4">2.4 Optional Biometric Data (If User Opts for Fast Checkout)</p>
            <p>
              Facial recognition scan data for one‑click login, collected solely with your written consent and never
              shared with external marketing agencies.
            </p>
          </SubSection>

          <SubSection title="3. Purposes of Data Usage">
            <p>We utilise your personal data strictly for the below legitimate business functions:</p>
            <List items={[
              'Process your fashion/lifestyle orders, arrange packaging, dispatch shipments and track delivery status',
              'Resolve return, refund, exchange and damage complaints via customer support',
              'Send order confirmation, delivery alert, payment receipt and refund processing notifications via SMS/email',
              'Customise product recommendations matching your browsing and purchase preferences',
              'Detect fraudulent transactions, fake refund claims and account hacking attempts to protect both users and UKVI Services',
              'Run limited marketing campaigns featuring new fashion arrivals, seasonal sales and lifestyle product launches; you can opt out of promotional communications anytime',
              'Comply with government tax filings, consumer authority inquiries and legal court orders',
              'Conduct internal market research to improve product catalogues, website user experience and delivery services',
            ]} />
            <p>If you deny permission for essential data collection required to process orders, we cannot fulfil your purchase requests.</p>
          </SubSection>

          <SubSection title="4. Data Sharing Protocols">
            <p>
              UKVI Services will never sell your personal data to unaffiliated third‑party marketing firms without your
              separate consent. Limited controlled sharing happens only in these scenarios:
            </p>
            <List items={[
              'Internal sharing: Within UKVI Services administrative, logistics and customer support teams for order fulfilment',
              'Partner vendors: Brand suppliers, courier delivery companies, payment gateways, warranty service providers who require basic shipping/contact data to complete your order',
              'Legal disclosure: Share data with Indian government departments, police, consumer courts and regulatory bodies when mandated by law, court summons or official investigation requests',
              'Damage/fraud resolution: Disclose relevant order data to third‑party brand owners to resolve counterfeit or defective product claims',
            ]} />
            <p>All partnered vendors are contractually obligated to maintain data confidentiality as per Indian privacy regulations.</p>
          </SubSection>

          <SubSection title="5. Data Security Measures">
            <p>We implement enterprise‑grade security protocols to protect your personal and financial data from unauthorised access, theft or leakage:</p>
            <BulletList items={[
              'Encrypted secure servers for all user account storage',
              'Password hash encryption for login credentials',
              'Restricted internal staff access to sensitive financial records with role‑based permissions',
              'Regular website security audits and malware scanning',
              'SSL encryption for all data transfer between your device and ukviservices.com',
            ]} />
            <p>
              Important Limitation: Internet data transmission carries inherent cyber risks beyond our control. You
              accept these online security risks while using the Platform, and you are fully responsible for keeping
              your account password confidential.
            </p>
          </SubSection>

          <SubSection title="6. Data Retention & Permanent Deletion">
            <List items={[
              'Retention Period: We retain your personal data only for the minimum required duration to complete order fulfilment, tax compliance and fraud prevention. Standard customer data is stored for 5 years post your last order, as mandated under Indian consumer laws. Anonymised behavioural analytics data may be stored indefinitely for internal research.',
              'Account Deletion Process: You may submit a permanent account deletion request via customer support (+91 9100690057). We will erase all your identifiable personal data within 15 working days, unless there are unresolved refunds, pending returns or ongoing legal disputes which require temporary data retention.',
              'Post‑Deletion Effect: Once your account is deleted, you lose access to all order history, saved addresses, reward points and purchase records permanently.',
            ]} />
          </SubSection>

          <SubSection title="7. Your Data Rights">
            <p>All registered users hold the following rights over their personal information:</p>
            <List items={[
              'Right to Access: Request a full copy of all stored personal data linked to your account',
              'Right to Rectify: Edit incorrect name, address, mobile number or email ID via platform profile settings',
              'Right to Erasure: Submit formal account deletion request as explained above',
              'Right to Opt‑Out: Stop receiving all promotional SMS, calls and marketing emails instantly by contacting the Grievance Officer Anas Khan',
            ]} />
          </SubSection>

          <SubSection title="8. Consent Withdrawal">
            <p>
              You may withdraw your previously granted data processing consent by sending an email to our official
              support with subject line: "Withdrawal of Consent for Personal Data Processing". We will verify your
              account ownership before processing the request.
            </p>
            <p>
              Consent withdrawal applies only to future data collection; it does not reverse lawfully completed past
              data processing activities. If you withdraw consent for mandatory order processing data fields, UKVI
              Services reserves the right to restrict your purchasing functionality on the Platform.
            </p>
          </SubSection>

          <SubSection title="9. Privacy Policy Updates">
            <p>
              We will revise this Privacy Policy periodically to align with updated Indian data protection regulations
              and business operational changes. Major policy amendments will be notified to registered users via email
              alerts. Users must review this document regularly to stay informed of revised clauses.
            </p>
          </SubSection>

          <SubSection title="10. Grievance Officer Contact">
            <ContactBox title="Grievance Officer" />
          </SubSection>
        </Section>

        <Section title="Refund & Cancellation Policy" id="refund-and-cancellation-policy">
          <p>
            Applicable to all branded‑fashion apparel, footwear, accessories and lifestyle goods sold on
            ukviservices.com. This section is part of the official policy document of UKVI Services, Grievance
            Officer: Anas Khan.
          </p>

          <SubSection title="1. Order Cancellation Eligibility">
            <List items={[
              'Valid cancellation requests are only accepted before the warehouse or assigned seller dispatches your ordered items. Once goods are handed‑over to courier partners, standard cancellation will not be allowed.',
              'Cancellation requests submitted after 5 calendar days of order placement will be rejected if the shipment has been marked out‑for‑delivery. Under such circumstances, you can refuse the parcel at the time of doorstep delivery to initiate a post‑delivery return procedure.',
              'Perishable‑lifestyle products such as scented candles, organic skincare items and edible gift hampers cannot be cancelled after dispatch. Refunds or replacements for these items will only be provided if you furnish clear proof of damaged, expired or defective products delivered to you.',
              'Custom‑embroidered outfits, personalised accessories and made‑to‑order merchandise are non‑cancellable once the production process commences, as items are specially crafted as per your requirements. No cancellation requests will be entertained for these categories under any normal scenario.',
              'Orders placed during flash sales, festival‑discount periods and limited‑stock campaigns are eligible for cancellation only within 24‑hours of placing the order. After this time frame, cancellation rights stand revoked.',
            ]} />
          </SubSection>

          <SubSection title="2. Refund Claims for Damaged, Defective or Wrong Items">
            <List items={[
              'If you receive torn, defective, broken, incorrectly sized products, or items different from your ordered selection, you must raise a formal refund request to our customer‑support team within 5 calendar‑days after receiving the package. You need to submit clear unboxing photos and original‑video footage as supporting evidence.',
              'Our partnered brand vendors will examine the submitted proof thoroughly before approving your refund‑request or product‑replacement option. The final decision of the brand‑partner shall be binding on the customer.',
              'When the delivered product varies significantly from website‑provided images, material descriptions, size charts or product specifications mentioned on ukviservices.com, you need to submit your complaint within 5 days‑of‑delivery for review and resolution.',
              "Items covered under the manufacturer's official brand warranty shall be resolved directly with the brand‑authorized service centre. UKVI Services will not process direct refunds for such products.",
            ]} />
          </SubSection>

          <SubSection title="3. Grounds for Refund Rejection">
            <p>UKVI Services reserves full authority to decline your refund application under the below‑mentioned conditions:</p>
            <List items={[
              'Damage is caused by improper customer‑usage, accidental scratches, stains, washing‑related damage, or wear and tear after usage.',
              'Original tags, security seals, dust‑bags, packaging boxes are lost, broken or tampered‑with.',
              'You submit false‑damage claims, edited‑photos or manipulated‑videos to obtain a wrongful refund.',
              'If you change your personal preference after opening the product; simple dislike for colour, fitting or design will not qualify you for a refund.',
            ]} />
          </SubSection>

          <SubSection title="4. Refund Processing Timeline">
            <List items={[
              'Once UKVI Services officially approves your refund application, the amount will be initiated back to your original payment mode within 7 working days.',
              "Bank transfers, UPI payments and wallet refunds might take an additional 2‑3 working days, which depends entirely upon your respective banking institution's internal settlement cycle.",
              'We never provide cash‑refunds. All refunds are processed digitally only to the original payment account used while placing your order. No requests to transfer funds to different third‑party bank accounts will be entertained for security purposes.',
            ]} />
          </SubSection>

          <SubSection title="5. Non‑Refundable Charges">
            <List items={[
              'Standard delivery‑fees, rush‑delivery surcharges, gift‑wrapping fees and customisation‑charges are non‑refundable in all regular‑cancellation scenarios.',
              'These charges will be waived and refunded only if the mistake is on our side, such as wrong‑item dispatch, dispatching out‑of‑stock products which were incorrectly marked available on our website.',
              'Payment gateway charges deducted by third‑party gateways are non‑refundable under all circumstances as per banking norms in India.',
            ]} />
          </SubSection>

          <SubSection title="6. Partial‑Order Cancellation">
            <p>
              If you place an order with multiple items, you can cancel individual products from your cart before
              dispatch. Delivery fees will be recalculated for the remaining items accordingly after partial
              cancellation. After dispatch, partial‑cancellation is not possible.
            </p>
          </SubSection>

          <SubSection title="7. Cancellation initiated by UKVI Services">
            <p>UKVI Services can cancel your order unilaterally without prior notice in cases:</p>
            <List items={[
              'The product goes out‑of‑stock unexpectedly after you place your order.',
              'There is an evident pricing error on the website due to system‑technical issues.',
              'Fraud‑related activities are detected from your account.',
            ]} />
            <p>In such scenarios, we will initiate a full‑refund without deducting any delivery‑related charges.</p>
          </SubSection>

          <SubSection title="8. Governing Terms">
            <p>
              This Refund and Cancellation Policy works alongside our Terms & Conditions, Return‑Exchange Policy and
              Shipping Policy of UKVI Services, website ukviservices.com. This policy is governed under Indian
              Consumer‑Protection Act and applicable Telangana state laws. In case of disputes, jurisdiction will be
              limited to courts in Hyderabad, India.
            </p>
          </SubSection>

          <ContactBox />
        </Section>

        <Section title="Return and Exchange Policy" id="return-policy">
          <p>
            This policy applies exclusively to branded fashion‑apparel, footwear, accessories and lifestyle goods sold
            through ukviservices.com and is governed under the Indian Consumer Protection Act, 2019. This policy works
            in conjunction with Terms & Conditions, Refund‑Cancellation Policy and Shipping Policy of our company.
          </p>

          <SubSection title="1. General Eligibility Criteria for Return and Exchange">
            <List items={[
              'The customer can apply for return or product‑exchange within 10 calendar days only from the date of delivery of the product. After completion of this 10‑day time‑frame, return‑exchange requests will be straight‑away rejected without any exceptions.',
              'This return‑exchange window applies only for domestic orders delivered within India. UKVI Services currently does not facilitate returns for international‑delivery orders.',
              'Exchange facility is primarily offered for size‑replacement, manufacturing defects, transit‑damaged products or wrong‑item delivery by our warehouse team. Simple change‑of‑choice or change‑of‑colour due to personal liking after receiving the product will not be considered for exchange approval.',
            ]} />
          </SubSection>

          <SubSection title="2. Mandatory Conditions to Approve Return‑Exchange Request">
            <p>Your return or exchange application will be validated only if all the below‑listed requirements are fulfilled completely:</p>
            <List items={[
              'The product must be unused, unworn, unwashed, free of stains, scratches, dirt, sweat marks and any physical damage caused after delivery by the customer.',
              'Original brand packaging, outer box, dust pouches, price tags, security seals, brand labels, invoice and all‑in‑pack complimentary accessories must be intact and attached to the product. If seals are broken or tags are removed, return will be declined.',
              'Products purchased during clearance sale, flash‑sale, festival limited‑time offers, bundle‑discount deals and final‑sale items are marked non‑returnable and non‑exchangeable at the time of checkout. No requests will be accepted for these products under any situation.',
              'Items such as inner‑wear, lingerie, socks, swimwear, beauty‑cosmetics, piercing jewellery, disposable lifestyle products are permanently non‑returnable for hygiene purposes as per industry standards and health‑safety norms.',
            ]} />
          </SubSection>

          <SubSection title="3. Situations Where Return‑Exchange Requests Are Rejected">
            <p>UKVI Services reserves full discretion to refuse your return‑exchange application under the following circumstances:</p>
            <List items={[
              'Damage arises because of improper use, rough handling, self‑alteration, stitching modifications, chemical exposure or regular wear‑and‑tear after usage.',
              'Customers submit manipulated photos, edited videos or fake‑damage proofs with the intention to get replacement or refund unlawfully.',
              'The returned parcel received at our warehouse is empty, contains different items or used products different from originally delivered goods.',
              'You place repeated exchange requests for the same order multiple times without valid manufacturing‑defect proof. We will reject subsequent applications in such cases.',
              'Custom‑made, personalised, embroidered products, engraved accessories and gift‑wrapping add‑ons cannot be returned or exchanged once production is completed.',
            ]} />
          </SubSection>

          <SubSection title="4. Step‑by‑Step Exchange Process">
            <List items={[
              'You need to raise an exchange request by contacting our customer‑support team (+91 9100690057) and share clear unboxing images or videos of defective or wrong‑delivered items within the allowed 10‑day window.',
              'Our internal team reviews your application and supporting evidence. After initial approval, we will send a reverse‑pick‑up courier agent to collect the product from your provided delivery address.',
              "Once our warehouse receives the returned item, our quality‑inspection team will verify the product's original condition within three working days.",
              'After successful inspection confirmation, we arrange delivery of the new replaced product to your registered shipping address. We provide one‑time free‑of‑cost replacement for each valid order. If you require a second exchange for the same order, shipping charges will be borne by you.',
              'Availability of new size or design depends on current stock status of the brand. If your preferred variant is out‑of‑stock, you can opt for a full refund instead of exchange.',
            ]} />
          </SubSection>

          <SubSection title="5. Return Procedure for Refund">
            <List items={[
              'If you do not want a replacement product, you can choose a full‑refund after return approval subject to policy terms.',
              'After our warehouse receives and validates your returned item, the refund amount will be processed back to your original payment account as mentioned under our Refund & Cancellation Policy within 7 working days. Bank settlement delays from payment providers can extend this period by additional 2‑3 working days.',
              'Return shipping cost: If the product is defective, damaged in transit or wrong item dispatched from our side, reverse‑shipping charges will be borne by UKVI Services. If you return the product due to change‑of‑mind or ordering wrong‑size without manufacturing‑defect, return courier charges will be deducted from your final refund amount.',
            ]} />
          </SubSection>

          <SubSection title="6. Partial Returns for Multi‑Item Orders">
            <p>
              When you place an order containing multiple products, you can return individual eligible items while
              keeping remaining products. Only the cost of returned items will be refunded to you. Original
              delivery‑charges for the overall order will not be refunded unless the whole order is returned due to our
              company's fault.
            </p>
          </SubSection>

          <SubSection title="7. Product Warranty Items">
            <p>
              Products with official manufacturer‑provided brand warranty shall be handled by the respective
              brand‑authorized service centres only. UKVI Services will not process direct returns or exchanges for
              such items. Customers have to contact the brand's official support team for warranty‑related repairs or
              replacements.
            </p>
          </SubSection>

          <SubSection title="8. Policy Amendments and Jurisdiction">
            <List items={[
              'UKVI Services holds the right to modify, add‑on or remove clauses of this Return‑Exchange Policy at any time without prior notice to customers. Updated version will be published on ukviservices.com for users to review periodically.',
              'Any disputes arising out of returns and exchanges shall be governed by the laws of India and jurisdiction shall be exclusively limited to courts of Hyderabad, Telangana.',
            ]} />
          </SubSection>

          <ContactBox title="Official Contact Details" />
        </Section>

        <Section title="Shipping Policy" id="shipping-policy">
          <p>
            This shipping policy is applicable for branded fashion, footwear, accessories and lifestyle items sold on
            our platform. It works together with Terms & Conditions, Privacy Policy, Refund‑Cancellation Policy and
            Return‑Exchange Policy and complies with the Consumer‑Protection Act, 2019 of India.
          </p>

          <SubSection title="1. Service Coverage">
            <List items={[
              'We presently provide domestic shipping all over India only. International shipment is not available for the time‑being.',
              'Our partnered delivery providers are verified registered domestic couriers and India Speed‑Post service. UKVI Services reserves the right to select the courier partner for each order as per service availability.',
            ]} />
          </SubSection>

          <SubSection title="2. Order‑Processing and Dispatch Timeline">
            <List items={[
              'After successful payment confirmation, our warehouse team will pack and dispatch your order within 15 calendar days. Orders placed on weekends, public holidays and festival seasons will be processed on subsequent working days.',
              'During peak sale periods such as festive sales, flash‑discount events, stock‑replenishment delays may extend dispatch time by 3‑5 additional days, which is completely beyond our control.',
              "Once your parcel is dispatched, a shipment tracking number along with courier‑tracking link will be sent to your registered email‑id and mobile number. Tracking details may take around 24 hours to get updated on the courier‑partner's official portal.",
            ]} />
          </SubSection>

          <SubSection title="3. Shipping Charges">
            <List items={[
              'Standard delivery fees will be calculated and displayed to customers on the checkout page before final payment. Rush‑delivery charges are applicable if you select expedited delivery mode.',
              'Shipping charges, rush‑delivery fees and gift‑wrapping costs paid at checkout are non‑refundable in regular circumstances. These delivery‑related fees will be refunded only if shipment issues arise due to mistakes from UKVI Services like wrong product dispatch or incorrect inventory status updated on our website.',
              'If your order value crosses our minimum threshold for free‑delivery criteria, delivery fees will be waived off accordingly.',
            ]} />
          </SubSection>

          <SubSection title="4. Delivery Address Responsibility">
            <List items={[
              'You must provide full, accurate house number, locality, district, valid contact number and pin‑code while placing orders. UKVI Services shall not be liable for non‑delivery, wrong‑delivery or returned parcels because of incomplete or wrong‑address information given by you.',
              'Once the goods are dispatched from our warehouse, we cannot modify your delivery address. Address‑change requests after dispatch will be declined by our team.',
            ]} />
          </SubSection>

          <SubSection title="5. Delayed Shipment, Lost or Damaged‑in‑Transit Goods">
            <List items={[
              'Estimated delivery days shared at checkout are approximate timelines. Courier back‑logs, heavy monsoon, transport strikes, government‑imposed restrictions, pandemic‑related curbs, natural disasters can cause delivery delays, for which UKVI Services will not be accountable.',
              'If your parcel gets lost or severely damaged during transit, you have to inform our customer‑support team within 3 working‑days after the expected delivery date. Our team will coordinate with the courier‑company for investigation. After verification we will either arrange product replacement or initiate a full refund as per your preference.',
              'Any physical damage found by you after receiving delivery should be reported with proper un‑boxing photos and videos within 5 calendar days from delivery date as mentioned in our return‑exchange policy. Post‑usage damages by customers will not be considered for replacement.',
            ]} />
          </SubSection>

          <SubSection title="6. Undelivered and Return‑to‑Origin (RTO) Shipments">
            <List items={[
              'If multiple delivery attempts made by courier partners are unsuccessful because you are unavailable at the provided address or you refuse to accept the package, the parcel will be sent back to our warehouse.',
              'Once we receive the returned item in original unused condition, we can process your refund after deducting the original outbound‑shipping charges and reverse‑logistics fees. If you want reshipment, fresh delivery charges will be applicable.',
            ]} />
          </SubSection>

          <SubSection title="7. Separate Shipments for Multi‑Item Orders">
            <p>
              For orders with multiple products, items may be dispatched from different warehouses in separate
              packages; hence packages can be delivered on different dates. Separate tracking IDs will be provided for
              each parcel accordingly.
            </p>
          </SubSection>

          <SubSection title="8. Governing Jurisdiction and Policy Revision">
            <List items={[
              'UKVI Services reserves the right to revise this Shipping Policy any time without prior notice to customers. Updated policy will be published on ukviservices.com for users to review regularly.',
              'Any disputes arising out of delivery‑related issues will be governed under Indian laws and exclusive jurisdiction lies with courts situated in Hyderabad, Telangana, India.',
            ]} />
          </SubSection>

          <ContactBox title="Official Contact Information" />
        </Section>
      </motion.div>
    </div>
  );
}
