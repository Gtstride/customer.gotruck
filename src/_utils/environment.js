function environment(name) {
    if (process.env.NODE_ENV === 'production') {
      return name && name !== 'customer'
        ? { url: `${name}.kobo360.com`, multiTenant: true, subdomain: name }
        : { url: 'customer.kobo360.com', multiTenant: false, subdomain: '' };
    } else if (process.env.NODE_ENV === 'staging') {
      return { url: 'stage.customer.kobo360.com', multiTenant: false };
    } else {
      return name && name !== 'localhost'
        ? { url: `${name}.localhost:3000`, multiTenant: true, subdomain: name }
        : { url: 'localhost:3000', multiTenant: false, subdomain: '' };
    }
  }
  
  // Have utility method for useParams
  export { environment };
  