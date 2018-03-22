import React from 'react';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import './styles.css';

const mapTenantsToDescription = (tenants) => {
    let description = "Participants: ";
    for(let i = 0; i < tenants.length; i++){
        const response = tenants[i].confirmed === null ? 'Unseen': tenants[i].confirmed ? "Accepted": "Declined";
        description += `\n${tenants[i].name} (${response})`;
    }
    return description;
}

const LeaseCard = ({
    lease,
    id
}) => (
    <Card
        header = { lease.title }
        meta = { moment(lease.start).format('MM-DD-YYYY') + ' to ' + moment(lease.end).format('MM-DD-YYYY') }
        description = { mapTenantsToDescription(lease.tenants) }
        extra = {
                <span >
                    <Button color='red' > End Lease </Button>
                </span>
            }
        key = { id }
    />
)

export default LeaseCard;
