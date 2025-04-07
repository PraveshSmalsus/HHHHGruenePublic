// SocialMediaIcon.js
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaLink } from 'react-icons/fa';

const SocialMediaIcon = ({ platform, postUrl }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(postUrl)
            .then(() => alert('URL copied to clipboard!'))
            .catch((err) => console.error('Failed to copy: ', err));
    };
    const handleRedirect = () => {
        let url = '';

        switch (platform.toLowerCase()) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
                break;
            case 'instagram':
                url = `https://www.instagram.com/?url=${encodeURIComponent(postUrl)}`;
                break;
            case 'copy-link':
                url = handleCopy();
                break;
            default:
                alert('Platform not supported!');
                return;
        }
        if (platform.toLowerCase() != "copy-link") {
            window.open(url, '_blank');
        }
    };

    const renderIcon = () => {
        switch (platform.toLowerCase()) {
            case 'facebook':
                return <FaFacebook />;
            case 'twitter':
                return <FaTwitter />;
            case 'linkedin':
                return <FaLinkedin />;
            case 'instagram':
                return <FaInstagram />;
            case 'copy-link':
                return <FaLink />;
            default:
                return null;
        }
    };

    return (
        <button title={platform} onClick={handleRedirect} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            {renderIcon()}
        </button>
    );
};

export default SocialMediaIcon;
