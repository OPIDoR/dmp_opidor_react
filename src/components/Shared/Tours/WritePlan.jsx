import { TbBulbFilled } from 'react-icons/tb';
import { BsGear } from 'react-icons/bs';
import { CommentSVG } from '../../Styled/svg';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    title: 'Découvrez les fonctionnalités de rédaction',
    content: (
      <>
        <p>
          Explorez nos nouveautés et découvrez notre interface améliorée grâce à notre visite guidée interactive !
        </p>
        <p>
          Plongez-vous dans une expérience immersive qui vous dévoilera toutes les fonctionnalités récentes et les améliorations apportées à notre plateforme.
        </p>
        <p>
          Ne manquez pas l'occasion de vous familiariser rapidement avec nos nouveautés.
        </p>
      </>
    ),
    placement: 'center',
    target: 'body',
  },
  {
    title: 'Découvrez les fonctionnalités de rédaction',
    content: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ width: '200px', textAlign: 'center' }}>
          <TbBulbFilled size={60} />
        </div>
        <div>
          <p>Ici ce trouve la sélection de vos recommendations.</p>
          <p>
            Après avoir sélectionné au préalable vos recommandations de plan, retrouvez celles proposées par les organismes choisis à droite de chaque question.
          </p>
          <p>Elles seront visibles en cliquant sur l'icône <TbBulbFilled size={14} /></p>
        </div>
      </div>
    ),
    placement: 'top',
    target: '#accordion-guidance-choice',
  },
  {
    title: 'Découvrez ou sont les commentaires',
    content: (
      <>
        <p>Vous retrouverez ici l'ensemble de vos produits de recherche.</p>
        <p>Pour en créer un nouveau, il vous suffit de cliquer sur "Créer", et à vous la création d'un nouveau produit de recherche !</p>
      </>
    ),
    placement: 'right',
    target: '#ro-nav-bar',
  },
  {
    title: 'Découvrez ou sont les commentaires',
    content: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
      }}>
        <div style={{ width: '230px', textAlign: 'center' }}>
          <BsGear size={30} style={{ margin: '0 5px 0 5px' }} />
          <TbBulbFilled size={30} style={{ margin: '0 5px 0 5px' }} />
          <CommentSVG size={30} style={{ margin: '0 5px 0 5px' }} />
        </div>
        <div>
          <p>Retrouvez dans cette partie, "Runs", "Commentaires", "Recommendations" et changement de fomrulaire.</p>
        </div>
      </div>
    ),
    placement: 'left',
    target: '#icons-container',
  },
];
