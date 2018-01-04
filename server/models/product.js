module.exports = function(connection, Sequelize) {
// employees this have to match the mysql table
// return Employees object is used within the JS
    const Product = connection.define(
        "grocery_list",
        {
            id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            upc12: {
                type: Sequelize.BIGINT(12),
                allowNull: false
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: 'grocery_list'
        }
    );
    return Product;
};