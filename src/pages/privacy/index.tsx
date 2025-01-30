import { Page } from 'components/common/page';
import config from 'config';
import { NewTabLink, externalLinks } from 'libs/routing';

const content = [
  {
    subtitle: 'About This Privacy Policy',
    html: (
      <p>
        This Privacy Policy has been created to inform the Users about how we
        manage, collect, store and use the personal information we receive and
        collect in connection with the Site.
      </p>
    ),
  },
  {
    subtitle: 'Acceptance of Policy',
    html: (
      <p>
        By using and interacting with our Site, you agree to the collection and
        use of your personal information in accordance with this Privacy Policy.
        If you don’t agree with the Privacy Policy, you are prohibited from
        using the Site or the Content.
      </p>
    ),
  },
  {
    subtitle: 'Changes to Our Privacy Policy',
    html: (
      <p>
        We may update this Privacy Policy to reflect changes to our information
        collection, usage and storage practices. If we make any changes that we
        determine are “material” (with such determination to be made in our sole
        reasonable discretion), we will notify you (using the notification
        methods set forth in the Notices section below) prior to the change
        becoming effective. We encourage you to periodically review this page
        for the latest information on our privacy practices.
      </p>
    ),
  },
  {
    subtitle: 'Information Collected and Purposes for Collection',
    html: (
      <>
        <p>
          Personal information is any data that personally identifies,
          describes, or could reasonably linked, directly or indirectly, with a
          particular individual or household. We collect some information about
          you or your device when you visit our Site that may be considered
          personal information, such as:
        </p>
        <li>
          Identifiers such as unique identifier, IP address, or online
          identifier
        </li>
        <li>
          Internet or electronic network activity, including browser type,
          browsing history, and information about your interactions with our
          website
        </li>
        <p>
          We collect this personal information that is necessary or appropriate
          for the marketing and functioning of the Site and the provision of the
          services offered by the Site. We receive some of this information
          directly from you when you register on the Site as member of a
          community or when you otherwise voluntarily provide such information
          to us. We use the information in order to administer the Site, its
          functions and for internal operations, including troubleshooting, data
          analysis, testing, research, statistical and survey purposes. We may
          also store information that your computer or mobile device provides us
          in connection with your use of the Site, such as your browser type,
          financial information, type of computer or mobile device, browser
          language and IP address.
        </p>
      </>
    ),
  },
  {
    subtitle: 'Disclosure of Your Information',
    html: (
      <p>
        We do not rent or sell any information about you to others or trade any
        such information. We may disclose your information with third parties
        employed by us to facilitate the operation of the Site and its
        functions, and to perform services related to administration of the Site
        and its functions. We may also disclose your information to third
        parties for marketing purposes, as described in our Cookies Statement.
        You understand and agree that we may also be required to disclose your
        personal information if required to do so by law or in the belief that
        such disclosure is reasonably necessary to avoid liability, to comply
        with legal process, including, but not limited to, a subpoena, statute,
        rule, regulation, law, search warrant or court order, or to protect our,
        or a third party’s, property and rights, to protect the safety of the
        public or any other person or entity, or to prevent or stop activity we
        may consider to be, or to pose a risk of being, illegal, unethical or
        legally actionable. In the event we will be acquired by or merged with a
        third party entity or other person or entity, or in the event of our
        bankruptcy or a comparable event, we reserve the right to transfer or
        assign personal information in connection with the foregoing events. We
        may also disclose your information with your consent, including in
        connection with a request by you made pursuant to the terms of the Your
        Rights section below.
      </p>
    ),
  },
  {
    subtitle: 'Cookies Statement',
    html: (
      <p>
        Cookies are small text files that are placed on your computer by
        websites that you visit (“Cookies”). We use Cookies. They are widely
        used in order to make websites work, or work more efficiently, as well
        as to provide information to the owners of the site. Cookies are
        typically stored on your computer's hard drive. Information collected
        from Cookies is used by us to evaluate the effectiveness of the Site and
        application programming interface (API) located on or used by the Site,
        analyze trends, and manage the platform. The information collected from
        Cookies allows us to determine such things as which parts of our Site
        are most visited and difficulties our visitors may experience in
        accessing our Site. With this knowledge, we can improve the quality of
        your experience on the platform by recognizing and delivering more of
        the most desired features and information, as well as by resolving
        access difficulties. We also use Cookies and may use a technology known
        as “web bugs” or “clear gifs,” which are typically stored in emails to
        help us confirm your receipt of, and response to, our emails and to
        provide you with a more personalized experience when using the Site. We
        also use third party service provider(s), to assist us in better
        understanding the use of our Site. Our service provider(s) will place
        Cookies on the hard drive of your computer and will receive information
        that we select that will educate us on such things as how visitors
        navigate around our site, what pages are browsed and general transaction
        information. Our service provider(s) analyze this information and
        provides us with aggregate reports. The information and analyses
        provided by our service provider(s) will be used to assist us in better
        understanding our visitors' and the Users’ interests in our Site and how
        to better serve those interests. The information collected by our
        service provider(s) may be linked to and combined with information that
        we collect about you while you are using the platform. Our service
        providers are contractually restricted from using information they
        receive from our Site other than to assist us. Your continued use of our
        Site, as well as any subsequent usage, will be interpreted as your
        consent to Cookies being stored on your device. You can manage your
        Cookies preferences by changing your browser settings on your device to
        refuse the use of all or some Cookies. However, if you block all
        Cookies, you may not be able to use all or some parts of the Site.
      </p>
    ),
  },
  {
    subtitle: 'Security',
    html: (
      <p>
        Everything we save is encrypted and we have implemented commercially
        reasonable technical and organizational measures designed to secure your
        information from accidental loss and from unauthorized access, use,
        alteration or disclosure. However, we cannot guarantee that unauthorized
        third parties will never be able to overcome those measures or use your
        information for improper purposes.
      </p>
    ),
  },
  {
    subtitle: 'Retention',
    html: (
      <p>
        We will only retain your personal information for only as long as
        reasonably necessary to fulfill the purposes described in this Privacy
        Policy, unless a longer retention period is required or permitted by
        law. As a general matter, we keep relevant customer information for the
        duration of your relationship with us and for a limited period of time
        after your last interaction with us. We may retain your personal
        information for a longer period in the event of a complaint or if we
        reasonably believe there is a likelihood of litigation, audit, or
        investigation, or if required by applicable law. When determining the
        appropriate data retention period, we consider the amount and nature of
        personal information, the purposes for which we collected it and whether
        we can achieve those through other means, and applicable legal,
        regulatory, tax, accounting, and other requirements.
      </p>
    ),
  },
  {
    subtitle: 'Processing and Transferring Your Information',
    html: (
      <p>
        The information provided will be saved and stored with the hosting and
        information backup providers (such as Google Cloud) in the United
        States, held and operated by third parties other than the Foundation or
        which may not be controlled by the Foundation. Upon providing your
        information to the Site, you agree and confirm that the Foundation may
        transfer to or save the information provided to the Site on servers
        located in the United States.
      </p>
    ),
  },
  {
    subtitle: 'Your Rights',
    html: (
      <p>
        You may review, correct, or delete the information collected by or
        through the Site or the Site’s functionalities by logging into your
        account and reviewing your account settings and profile. You have a
        right to access to your personal information held by us by requesting a
        copy in writing. We will provide you with such copy after receiving a
        valid request. We may charge you a fee, which shall not exceed the cost
        for such copy. We may request proof of identification to verify your
        access request and reject any unfair or suspicious request in our sole
        discretion. To exercise this right, please refer to the Contact Us
        section below.
      </p>
    ),
  },
  {
    subtitle:
      'Notice to European Union and United Kingdom Residents (“GDPR Notice”)',
    html: (
      <>
        <p>
          In accordance with the European Union General Data Protection
          Regulation and the United Kingdom General Data Protection Regulation
          (together, the “GDPR”), we are providing this GDPR Notice to European
          Union (“EU”) and United Kingdom (“UK”) residents to explain how we
          collect, use and share their personal data (as defined in the GDPR),
          and the rights and choices we offer EU and UK residents regarding our
          handling of their personal information.
        </p>
        <p>
          We process personal data for the purposes described in the Information
          Collection and Purposes for Collection section of this Privacy Policy.
          We will store your personal information as described in the Retention
          section. We process your data where you have provided your consent for
          us to do so, and/or for at least one of the following legal reasons:
          (i) to perform our contracts and agreements with you; (ii) to comply
          with legal obligations; (iii) to pursue our legitimate interests;
          and/or (iv) to serve the public interest.
        </p>
        <p>
          As an EU or UK resident, you have various rights in connection with
          the processing of your personal data as follows:
        </p>
        <br />
        <li>
          You have the right to information about your personal data processed
          by us and to the following information: (a) the processing purposes;
          (b) the categories of personal data being processed; (c) the
          recipients or categories of recipients to whom the personal data have
          been or are being disclosed, in particular recipients in third
          countries or international organizations; (d) if possible, the planned
          duration for which the personal data will be stored or, if this is not
          possible, the criteria for determining this duration; (e) the
          existence of a right to rectification or deletion of your personal
          data, to restricting the processing of your personal data or to
          objecting to such processing; (f) the existence of a right of appeal
          to a supervisory authority; (g) if the personal data is not collected
          from you, all available information about the origin of the data; (h)
          the existence of automated decision-making and, at least in these
          cases, meaningful information on the logic involved and the scope and
          intended impact of such processing on the data subject; and (i) in the
          case of the transfer of personal data to a third country or an
          international organization, on the appropriate safeguards in relation
          to the transfer.
        </li>
        <li>
          You have the right to immediately request the rectification of
          inaccurate personal data concerning you and, taking into account the
          purposes of the processing, the completion of incomplete personal
          data, by means of providing a supplementary statement.
        </li>
        <li>
          You have the right to request the immediate erasure of personal data
          concerning you and we are obliged to delete this data immediately if
          one of the following reasons applies: (i) the personal data is no
          longer necessary for the purposes for which they were collected or
          otherwise processed; (ii) you revoke your consent on which the
          processing was based under Article 6(1)(a) or Article 9(2)(a) of the
          GDPR and there is no other legal basis for the processing; (iii) you
          object to the processing pursuant to Article 21(1) of the GDPR and
          there are no overriding legitimate grounds for processing or you
          object to the processing pursuant to Article 21(2) of the GDPR; (iv)
          your personal data has been processed unlawfully; (v) the deletion of
          your personal data is necessary to fulfill a legal obligation under UK
          law, EU law or the law of the EU member states to which we are
          subject; (vi) the personal data have been collected in relation to
          information society services provided in accordance with Article 8(1)
          of the GDPR. If we have made personal data public and are obliged to
          erase personal data in accordance with Article 17(1) of the GDPR, we
          will take appropriate measures, including technical measures, taking
          into account the available technology and the implementation costs, to
          inform controllers who process the personal data you have requested
          the erasure by such controllers of any links to or copies or
          replications of, such personal data.
        </li>
        <li>
          The rights in the foregoing paragraph do not apply to the extent that
          processing is necessary (A) to exercise the right of freedom of
          expression and information; (B) to fulfill a legal obligation required
          for processing under UK law, EU law or the law of the EU member states
          to which we are subject; or (C) to assert, exercise or defend legal
          claims.
        </li>
        <li>
          You have the right to request that we restrict processing if one of
          the following conditions is met: (1) the accuracy of the personal data
          is contested by you, for a period of time that enables us to verify
          the accuracy of the personal data; (2) the processing is unlawful and
          you oppose the deletion of the personal data and instead request the
          restriction of the use of your personal data; (3) we no longer need
          your personal data for the purposes of processing, but you do need it
          to assert, exercise or defend legal claims; or (4) you have objected
          to the processing pursuant to Article 21(1) of the GDPR pending the
          verification of whether the legitimate interests of our company
          override your legitimate interests.
        </li>
        <li>
          You have the right to receive the personal data concerning you that
          you have provided to us in a structured, commonly used and
          machine-readable format and you have the right to transmit this data
          to another controller without hindrance, provided that the processing
          is based on a consent pursuant to Article 6(1)(a) or Article 9(2)(a)
          of the GDPR or on a contract pursuant to Article 6(1)(b) of the GDPR
          and the processing is carried out by automated means. When exercising
          your right to data portability, you have the right to have your
          personal data transferred directly by us to another controller, to the
          extent that such transfer is technically feasible.
        </li>
        <li>
          You have the right to object at any time, for reasons arising from
          your particular situation, to the processing of personal data
          concerning you which is based on Article 6(1)(e) or (f) of the GDPR,
          including profiling based on these provisions. We will no longer
          process your personal data unless we can demonstrate compelling
          legitimate reasons for the processing that override your interests,
          rights and freedoms or the processing serves to assert, exercise or
          defend legal claims.
        </li>
        <li>
          You have the right to revoke your consent to the processing of your
          personal data at any time. The revocation of consent does not affect
          the legality of the processing carried out on the basis of the consent
          until revocation.
        </li>
        <br />
        <p>
          If you wish to assert your rights to information, correction, deletion
          or restriction of processing, object to data processing or revoke your
          consent to data processing, please contact us as prescribed in the
          Contact Us section below. If you consider that the processing of
          personal data concerning you infringes the GDPR, then you can lodge a
          complaint with a supervisory authority, in particular in the member
          state of your habitual residence, your place of work or the place of
          the alleged infringement.
        </p>
      </>
    ),
  },
  {
    subtitle:
      'Notice to Site Visitors from the United States (“CCPA and VCDPA” Notice)',
    html: (
      <>
        <p>
          If you a resident of the United States, you are prohibited from using
          our Site pursuant to our Terms of Service. If you, however, have
          incidentally reached our Site, we may collect some information. If you
          are a resident of California, you are entitled to certain rights under
          the California Consumer Privacy act of 2018 (“CCPA”), and if you are a
          resident of Virginia, you are entitled to certain rights under the
          Virginia Consumer Data Protection Act (“VCDPA”).
        </p>
        <br />
        <p>
          Over the past twelve months, we may have collected the personal
          information specified in the Information Collected and Purposes for
          Collection section of this Privacy Policy about visitors of our Site
          from California or Virginia. We obtain this information indirectly
          from you, such as by observing your actions on our Site or from third
          parties that we use to support our business. We may use or disclose
          this information for the following business or commercial purposes:
        </p>
        <br />
        <li>To provide and improve our Site;</li>
        <li>To ensure the security and integrity of our Site;</li>
        <li>
          To comply with our legal obligations, and exercise or defend legal
          claims; and/or
        </li>
        <li>To protect our Site against fraud or other illegal activity.</li>
      </>
    ),
  },
  {
    subtitle: 'Your Rights to Know and Access Your Information',
    html: (
      <>
        <p>
          If you wish to know the information that we have collected about you
          in the last 12 months, you may submit a verifiable consumer request to
          us, and subject to our verification of that request, we will provide
          you with the following information:
        </p>
        <br />
        <li>The categories of information we have collected about you;</li>
        <li>
          The categories of sources from which the information is collected;
        </li>
        <li>
          The business or commercial purpose for collecting, disclosing or
          selling, if applicable, the personal information;
        </li>
        <li>
          The categories of third parties with whom we have shared or sold, if
          applicable, your information; and
        </li>
        <li>The specific pieces of information we have collected about you.</li>
        <br />
        <p>
          In addition to these disclosures, you may submit a verifiable consumer
          request up to two (2) times in a twelve (12)-month period for access
          to your information we have collected. When you submit an access
          request, you can ask us to deliver the information by mail or
          electronically. If you elect to receive the information
          electronically, to the extent it is technically feasible for us to do
          so, we will provide it in a portable and readily useable format.
        </p>
        <br />
        <p>
          In order to submit a verifiable consumer request, please visit the How
          You Can Submit a Verifiable Consumer Request section below.
        </p>
      </>
    ),
  },
  {
    subtitle: 'Your Right to Delete',
    html: (
      <>
        <p>
          If you want us to delete the information we have collected from you,
          or obtained about you, you can send us a verifiable consumer request
          requesting that we delete some or all of such information, subject to
          certain exceptions. Once we receive and confirm your request to
          delete, we will delete such information from our active records,
          unless an exception applies. We will also notify any service providers
          and third parties with whom we have disclosed your information of your
          request.
        </p>
        <br />
        <p>
          Deletion requests are subject to certain limitations. We are not
          required to delete information where we are permitted or required to
          retain it, such as for tax, or record keeping purposes, to process
          orders and transactions, and for solely internal uses consistent with
          your relationship with us. If we deny your request to delete based on
          any of these exceptions, we will inform you in writing of the reason.
        </p>
      </>
    ),
  },
  {
    subtitle: 'Your Right to Correct',
    html: (
      <p>
        If you want to correct inaccuracies in the information that we have
        collected, processed, or otherwise obtained about you in the last twelve
        (12) months, you may submit a verifiable consumer request to us, and
        subject to our verification of that request, we will provide you with
        the opportunity to correct the inaccuracies, taking into account the
        purposes of processing the personal information.
      </p>
    ),
  },
  {
    subtitle:
      'How to Submit a Verifiable Consumer Request to Know, Access, Correct, or Delete',
    html: (
      <>
        <p>
          For us to process a request to know, access, correct, or delete, it is
          necessary for us to verify your identity. We will ask you to provide
          certain additional information about yourself, such as name, physical
          address, email address and phone number, or other identifying
          information, to compare to information we have on file for you to
          verify your identity. We cannot fulfil your request if we cannot
          verify your identity. It may take up to forty-five (45) days to fulfil
          your request. If we cannot complete your request within the initial
          forty-five (45) day period, we will notify you in writing within
          forty-five (45) days of your initial request.
        </p>
        <br />
        <p>
          To request exercise one or more of your consumer rights, please submit
          a verifiable consumer request to: privacy@bancor.network.
        </p>
        <br />
        <p>
          California residents may authorize another person (your “agent”) to
          submit a request on your behalf. We will also require that you provide
          us with information sufficient for us to verify that you have
          authorized this person to act for you and to verify your identity as
          provided above.
        </p>
        <br />
        <p>
          Virginia residents may appeal our decision denying your initial
          request by submitting an additional request pursuant to the directions
          set forth in the prior paragraphs. Within 60 days of receipt of your
          appeal, we will inform you of any action taken or not taken in
          response to your appeal, along with a written explanation for these
          actions.
        </p>
      </>
    ),
  },
  {
    subtitle:
      'Your Right to Opt Out of the Sale or Sharing of Your Information',
    html: (
      <p>
        We currently disclose information collected through our Site to third
        parties, which under the CCPA may be considered a “sale.” In addition,
        we may share information with third parties for the purpose of targeted
        advertising. You have the right to opt out of the sale or sharing of
        your information by clicking the “Do Not Sell or Share My Personal
        Information” link on our Site or by clicking this{' '}
        <button
          onClick={() => window?.OneTrust?.ToggleInfoDisplay()}
          id="ot-sdk-btn"
          className="text-primary"
        >
          <u>Cookie Settings</u>
        </button>
        , or by emailing us at privacy@bancor.network.
      </p>
    ),
  },
  {
    subtitle: 'Your Right to Non-Discrimination',
    html: (
      <p>
        We do not discriminate against consumers for exercising any of their
        rights with respect to their information. If you exercise any of your
        rights under this Privacy Policy, we will not deny you goods or
        services; charge you different prices or rates for goods or services; or
        provide different levels or quality of goods or services to you. For the
        avoidance of doubt and as noted above, residents of the United States
        cannot use our Site per our Terms of Service.
      </p>
    ),
  },
  {
    subtitle: 'Notices',
    html: (
      <p>
        Notices to you may be made via our website. The Foundation may also
        provide notices of changes to this Privacy Policy or other matters by
        displaying notices or links to notices to you generally on the Site. You
        agree that all agreements, notices, disclosures and any other
        communications that the Foundation provides satisfy any legal
        requirement that such communications be in writing.
      </p>
    ),
  },
  {
    subtitle: 'Contact Us',
    html: (
      <p>
        For any questions about this Privacy Policy or any other issue regarding
        the Foundation or the Site relating hereto, please contact us at:
        privacy@bancor.network.
      </p>
    ),
  },
];

export const PrivacyPage = () => {
  if (!config.ui.showPrivacy) return;
  return (
    <Page title={'Privacy Policy'}>
      <>
        <span>Last updated: {config.policiesLastUpdated}</span>
        <p>
          if you have not reviewed THIS PRIVACY POLICY since the “last updated”
          date above, It is your responsibility to re-review IT.
        </p>
        <p>
          THIS PRIVACY POLICY IS SUBJECT IN ALL RESPECTS TO THE TERMS OF USE
          AVAILABLE AT{' '}
          <NewTabLink
            className="text-primary underline"
            to={externalLinks.terms}
          >
            {config.appUrl.toUpperCase()}/TERMS
          </NewTabLink>{' '}
          (THE “TERMS OF USE”), AND BY ACCEPTING SUCH TERMS OF USE PURSUANT TO
          THE TERMS THEREIN OR BY USING THE SITE, YOU ALSO HEREBY AGREE TO
          ACCEPT THE TERMS OF THIS PRIVACY POLICY IN ALL RESPECTS.
        </p>
        <p>
          IF YOU DO NOT AGREE WITH THE TERMS OF USE OR THIS PRIVACY POLICY, DO
          NOT ACCESS OR USE THE SITES.
        </p>
        <p className="mt-40">
          By accessing or using{' '}
          <a
            href="https://www.carbondefi.xyz"
            target={'_blank'}
            rel="noreferrer"
            className="text-primary underline"
          >
            https://www.carbondefi.xyz
          </a>{' '}
          , and any linked or directed subdomain therein (collectively, the
          “Site”) and any content made available on or through the Site, you
          (the “User” and collectively with others using the Site, the “Users”,
          and “you” or “your” as used herein refers to you as the User) agree to
          be bound by this privacy policy (this “Privacy Policy”). The rights in
          the Site are held by Bprotocol Foundation, a Swiss foundation, with
          legal seat in Zug, Switzerland, registered in the Swiss commercial
          register under UID CHE-181.679.849 (the “Foundation”), and the terms
          “we,” “us,” and “our” refer to the Foundation. Please read this
          Privacy Policy carefully. This Privacy Policy, together with the Terms
          of Use, govern your access to and use of the Site and Content (as
          defined in the Terms of Use).
        </p>

        {content.map((item, index) => (
          <div key={index} className="legal pt-10">
            <h2 className="mb-10 text-[20px] font-semibold">{item.subtitle}</h2>
            <div className="mb-20 text-[16px]">{item.html}</div>
          </div>
        ))}
      </>
    </Page>
  );
};
